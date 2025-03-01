import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    ArrowUpIcon,
    BellIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CogIcon,
    HomeIcon,
    MapIcon,
    PlusIcon,
    UserCircleIcon,
    XIcon,
    InfoIcon,
} from "lucide-react";
import apiClient from "../../../services/api.config";
import L from "leaflet";

const PostIssueModal = ({
    onClose,
    showPostIssueModal,
    userLocation,
    setUserLocation,
}) => {
    // State for form data
    const [formData, setFormData] = useState({
        issueType: "public",
        category: "",
        title: "",
        description: "",
        address: "",
        areaCode: "",
        photos: [],
    });

    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [isGeocodingEnabled, setIsGeocodingEnabled] = useState(true);
    const [isGeocodingInProgress, setIsGeocodingInProgress] = useState(false);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [address, setAddress] = useState("");

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const geocodingTimeoutRef = useRef(null);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle category selection
    const handleCategorySelect = (category) => {
        setFormData((prev) => ({
            ...prev,
            category,
        }));
    };

    // Handle image upload
    const handleImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please upload only image files");
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size should not exceed 5MB");
            return;
        }

        // Create a preview URL
        const imageUrl = URL.createObjectURL(file);

        // Update formData with the new image
        setFormData((prev) => {
            const newPhotos = [...prev.photos];
            newPhotos[index] = {
                file,
                preview: imageUrl,
            };
            return {
                ...prev,
                photos: newPhotos,
            };
        });
    };

    // Handle image removal
    const handleRemoveImage = (index) => {
        setFormData((prev) => {
            const newPhotos = [...prev.photos];
            if (newPhotos[index]?.preview) {
                URL.revokeObjectURL(newPhotos[index].preview);
            }
            newPhotos[index] = null;
            return {
                ...prev,
                photos: newPhotos,
            };
        });
    };
    // Add this function to your NewPostModal component
    const handleSubmitPostIssue = async (e) => {
        e.preventDefault();

        try {
            // Show loading state if needed
            // setIsSubmitting(true);

            // Create FormData object for multipart/form-data submission
            const formDataToSend = new FormData();

            // Add all the text fields
            formDataToSend.append("issueType", formData.issueType);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);

            // Add location data
            if (userLocation) {
                const locationData = {
                    address: address,
                    coordinates: {
                        type: "Point",
                        coordinates: [userLocation.lng, userLocation.lat], // Note: API expects [longitude, latitude]
                    },
                    areaCode: formData.areaCode || "",
                };

                formDataToSend.append("location", JSON.stringify(locationData));
            } else {
                throw new Error("Location data is required");
            }

            // Add reporter data - this should be the current user info from your auth system
            // This is just a placeholder - replace with actual user data from your auth context
            const currentUser = {
                userId:
                    localStorage.getItem("userId") ||
                    "650a1b23e4c2f5d987654321", // Replace with actual user ID
                username: localStorage.getItem("username") || "user", // Replace with actual username
            };

            formDataToSend.append("reportedBy", JSON.stringify(currentUser));

            // Add photos
            formData.photos.forEach((photo) => {
                if (photo && photo.file) {
                    formDataToSend.append("photos", photo.file);
                }
            });

            // Make the API request
            const response = await apiClient.post("/issues", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Issue posted successfully:", response.data);

            // Optional: Reset form after successful submission
            setFormData({
                issueType: "public",
                category: "",
                title: "",
                description: "",
                address: "",
                areaCode: "",
                photos: [],
            });

            // Close modal
            onClose();

            // Show success message if needed
            // setSuccessMessage("Issue reported successfully!");
        } catch (error) {
            console.error("Error posting issue:", error);

            // Handle specific errors
            let errorMessage = "Failed to post issue. Please try again.";

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Error response:", error.response.data);
                errorMessage = error.response.data.error || errorMessage;
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage =
                    "No response from server. Please check your connection.";
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = error.message || errorMessage;
            }

            // Show error message to user
            // setErrorMessage(errorMessage);
            alert(errorMessage); // Replace with your preferred error handling
        } finally {
            // Reset loading state if needed
            // setIsSubmitting(false);
        }
    };

    // Safe geocoding function with rate limiting and error handling
    const safeReverseGeocode = useCallback(
        (lat, lng) => {
            if (!isGeocodingEnabled || isGeocodingInProgress) return;

            setIsGeocodingInProgress(true);

            // Add a user-agent header to comply with Nominatim usage policy
            const headers = {
                "User-Agent": "CityFix-App/1.0",
                "Accept-Language": "en",
            };

            // Use a timeout to prevent too many requests
            if (geocodingTimeoutRef.current) {
                clearTimeout(geocodingTimeoutRef.current);
            }

            geocodingTimeoutRef.current = setTimeout(() => {
                fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
                    { headers }
                )
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(
                                `HTTP error! Status: ${response.status}`
                            );
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if (data.display_name) {
                            setAddress(data.display_name);
                            setFormData((prev) => ({
                                ...prev,
                                address: data.display_name,
                            }));
                        }
                        setIsGeocodingInProgress(false);
                    })
                    .catch((error) => {
                        console.error("Error fetching address:", error);
                        setAddress(
                            `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
                        );
                        if (
                            error.message.includes(
                                "ERR_INSUFFICIENT_RESOURCES"
                            ) ||
                            error.message.includes("429")
                        ) {
                            setIsGeocodingEnabled(false);
                        }
                        setIsGeocodingInProgress(false);
                    });
            }, 1000);
        },
        [isGeocodingEnabled, isGeocodingInProgress]
    );

    // Get user's current location
    const getCurrentLocation = useCallback(() => {
        setIsLoadingLocation(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setIsLoadingLocation(false);
            return;
        }

        const onSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setIsLoadingLocation(false);

            // Update map view if it exists
            if (mapRef.current && markerRef.current) {
                mapRef.current.setView([latitude, longitude], 16);
                markerRef.current.setLatLng([latitude, longitude]);
                safeReverseGeocode(latitude, longitude);
            }
        };

        const onError = (error) => {
            console.error("Geolocation error:", error);
            setLocationError(
                `Unable to retrieve your location: ${error.message}`
            );
            setIsLoadingLocation(false);
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
        });
    }, [safeReverseGeocode, setUserLocation]);

    // Initialize map when modal opens and location is available
    useEffect(() => {
        if (!showPostIssueModal || !mapContainerRef.current || mapInitialized)
            return;

        const initMap = () => {
            try {
                // Clean up existing map if it exists
                if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null;
                    markerRef.current = null;
                }

                // Create new map instance
                const map = L.map(mapContainerRef.current, {
                    center: userLocation
                        ? [userLocation.lat, userLocation.lng]
                        : [20.5937, 78.9629], // Default to India's center if no location
                    zoom: userLocation ? 16 : 5,
                    attributionControl: true,
                });

                L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        attribution: "© OpenStreetMap contributors",
                    }
                ).addTo(map);

                // Add marker if we have user location
                if (userLocation) {
                    const marker = L.marker(
                        [userLocation.lat, userLocation.lng],
                        {
                            draggable: true,
                        }
                    ).addTo(map);

                    marker.on("dragend", () => {
                        const position = marker.getLatLng();
                        setUserLocation({
                            lat: position.lat,
                            lng: position.lng,
                        });
                        if (isGeocodingEnabled) {
                            safeReverseGeocode(position.lat, position.lng);
                        }
                    });

                    markerRef.current = marker;
                }

                mapRef.current = map;
                setMapInitialized(true);

                // If we don't have user location yet, try to get it
                if (!userLocation) {
                    getCurrentLocation();
                }
            } catch (error) {
                console.error("Error initializing map:", error);
            }
        };

        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(initMap);

        // Cleanup function
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
                setMapInitialized(false);
            }
            if (geocodingTimeoutRef.current) {
                clearTimeout(geocodingTimeoutRef.current);
            }
        };
    }, [
        showPostIssueModal,
        userLocation,
        safeReverseGeocode,
        getCurrentLocation,
    ]);

    // Update map size when container changes
    useEffect(() => {
        if (mapRef.current && mapInitialized) {
            mapRef.current.invalidateSize();
        }
    }, [mapInitialized]);

    if (!showPostIssueModal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
                <div className="px-8 py-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Report New Issue
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Fill in the details below to report a public issue
                    </p>
                </div>

                <form
                    onSubmit={handleSubmitPostIssue}
                    className="px-8 py-6 max-h-[calc(100vh-250px)] overflow-y-auto"
                >
                    <div className="space-y-6">
                        <input
                            type="hidden"
                            name="issueType"
                            value={formData.issueType}
                        />

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    "infrastructure",
                                    "publicSafety",
                                    "environmental",
                                    "governmentServices",
                                    "socialWelfare",
                                    "publicTransportation",
                                    "plumbing",
                                    "electricity",
                                    "carpentry",
                                    "cleaning",
                                    "other",
                                ].map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() =>
                                            handleCategorySelect(cat)
                                        }
                                        className={`flex items-center px-4 py-3 rounded-lg border-2 transition-all group
                                            ${
                                                formData.category === cat
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <InfoIcon
                                                size={18}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 capitalize">
                                            {cat
                                                .replace(/([A-Z])/g, " $1")
                                                .trim()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter a clear title for the issue"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Provide detailed description of the issue"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location
                            </label>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter address"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all flex items-center"
                                        disabled={isLoadingLocation}
                                    >
                                        {isLoadingLocation ? (
                                            <span className="flex items-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Loading
                                            </span>
                                        ) : (
                                            <span>Current Location</span>
                                        )}
                                    </button>
                                </div>

                                {locationError && (
                                    <div className="text-red-500 text-sm">
                                        {locationError}
                                    </div>
                                )}

                                {!isGeocodingEnabled && (
                                    <div className="text-amber-600 text-xs flex items-center">
                                        <InfoIcon size={14} className="mr-1" />
                                        Address lookup temporarily unavailable.
                                        Using coordinates instead.
                                    </div>
                                )}

                                <div className="h-60 bg-gray-100 rounded-lg relative">
                                    {!userLocation ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <MapIcon
                                                size={24}
                                                className="text-gray-400 mb-2"
                                            />
                                            <span className="text-sm text-gray-500">
                                                {isLoadingLocation
                                                    ? "Getting your location..."
                                                    : locationError
                                                    ? "Location error"
                                                    : "Click 'Current Location' to show map"}
                                            </span>
                                        </div>
                                    ) : (
                                        <div
                                            ref={mapContainerRef}
                                            className="h-full w-full rounded-lg"
                                        ></div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Latitude"
                                        value={
                                            userLocation
                                                ? userLocation.lat.toFixed(6)
                                                : ""
                                        }
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Longitude"
                                        value={
                                            userLocation
                                                ? userLocation.lng.toFixed(6)
                                                : ""
                                        }
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        name="areaCode"
                                        value={formData.areaCode}
                                        onChange={handleInputChange}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Area Code (Optional)"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 flex items-center">
                                    <InfoIcon size={14} className="mr-1" />
                                    Drag the marker to adjust the exact location
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Photos
                            </label>
                            <div className="grid grid-cols-4 gap-3">
                                {[0, 1, 2, 3].map((index) => (
                                    <div
                                        key={index}
                                        className="aspect-square w-full max-w-[120px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 relative overflow-hidden group"
                                    >
                                        {formData.photos[index] ? (
                                            // Show uploaded image preview
                                            <div className="w-full h-full relative">
                                                <img
                                                    src={
                                                        formData.photos[index]
                                                            .preview
                                                    }
                                                    alt={`Photo ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveImage(index)
                                                    }
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <XIcon size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            // Show upload button
                                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleImageUpload(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                />
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 group-hover:bg-blue-200 transition-all transform group-hover:scale-110">
                                                    <PlusIcon
                                                        size={16}
                                                        className="text-blue-600"
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600">
                                                    Photo {index + 1}
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center">
                                <InfoIcon size={14} className="mr-1" />
                                Upload up to 4 photos (Max 5MB each)
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-6 pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-200 font-medium transition-all focus:ring-2 focus:ring-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transform hover:scale-105"
                        >
                            Post Issue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostIssueModal;
