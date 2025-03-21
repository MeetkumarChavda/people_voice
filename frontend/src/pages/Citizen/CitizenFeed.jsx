import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    ArrowUpIcon,
    BellIcon,
    ChevronLeftIcon,
    MapIcon,
    PlusIcon,
    UserCircleIcon,
    XIcon,
    InfoIcon,
    Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import apiClient from "../../services/api.config";
import PostIssueModal from "./components/NewPostModal";

const CitizenFeed = () => {
    // State
    const [activePhase, setActivePhase] = useState("inProgress");
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState("feed");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [upvoted, setUpvoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(136);
    const [commentUpvoted, setCommentUpvoted] = useState({});
    const [showPostIssueModal, setShowPostIssueModal] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [expandedComments, setExpandedComments] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [isGeocodingEnabled, setIsGeocodingEnabled] = useState(true);
    const [issues, setIssues] = useState([]);
    const [profile, setProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const postIssueMapRef = useRef(null);
    const postIssueMarkerRef = useRef(null);
    const geocodingTimeoutRef = useRef(null);

    const navigate = useNavigate();

    // Function to fetch issues from API
    const fetchIssues = async (page = 1, limit = 100, filters = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            // Construct query parameters
            const params = {
                page,
                limit,
                ...filters,
            };

            const response = await apiClient.get("/issues/priority/advanced", {
                params,
            });
            console.log("Fetched issues:", response);
            setIssues(response.issues || response);
            return response;
        } catch (err) {
            console.error("Error fetching issues:", err);
            setError("Failed to fetch issues. Please try again later.");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get("/auth/profile");
            console.log("Fetched profile:", response);
            response.user.avatar = response.user.name.charAt(0);
            setProfile(response.user || response);
            return response;
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to fetch profile. Please try again later.");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch issues when component mounts
    useEffect(() => {
        // Example: Fetch first page with 10 items per page, filtering by status "pending" or "inProgress"
        fetchIssues(1, 10, { status: ["pending", "inProgress"] });
        fetchProfile();
        getUserLocation();
    }, []);

    // Dummy data
    const currentUser = {
        _id: "123456",
        name: "Rahul Kumar",
        location: "Koramangala, Bangalore",
        avatar: "RK",
        points: 3580,
    };

    const currentIssue = {
        _id: "4289",
        category: "infrastructure",
        title: "Broken Street Light at 5th Cross Road",
        description:
            "The street light at the corner of 5th Cross Road and 10th Main has been non-functional for over a week now. This has created a safety hazard for pedestrians and vehicles during night time. Immediate attention required.",
        reportedBy: {
            userId: "123456",
            username: "Rahul Kumar",
        },
        location: {
            address: "5th Cross Road",
            area: "Koramangala 5th Block",
            coordinates: [12.9279, 77.6271],
        },
        coordinates: [12.9279, 77.6271],
        createdAt: "2024-02-25T00:00:00Z",
        updatedAt: "2024-03-04T00:00:00Z",
        status: "inProgress",
        assignedTo: {
            role: "Corporation",
            name: "Bangalore City Corporation (Infrastructure Dept.)",
        },
        upvotes: 136,
        comments: [
            {
                id: "1",
                userId: "789012",
                username: "Priya Joshi",
                comment:
                    "I've also noticed this issue. It's particularly dangerous because there's a school nearby.",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                upvotes: 8,
            },
            {
                id: "2",
                userId: "345678",
                username: "Arun Chandran • Area Counsellor",
                comment:
                    "Thank you for reporting this issue. I've escalated this to the electrical department and they have assigned a team to fix it by March 4th.",
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                upvotes: 12,
            },
            {
                id: "3",
                userId: "901234",
                username: "Bangalore Municipal Corporation",
                comment:
                    "Work order has been generated. Our team will be on site tomorrow.",
                timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
                upvotes: 22,
            },
        ],
    };

    const similarIssues = [
        {
            title: "Street Light Out on 7th Main",
            distance: 2.3,
            status: "inProgress",
            upvotes: 92,
            timeAgo: "3 days ago",
        },
        {
            title: "Damaged Footpath near Park",
            distance: 1.8,
            status: "verified",
            upvotes: 54,
            timeAgo: "1 day ago",
        },
        {
            title: "Traffic Signal Malfunction",
            distance: 0.8,
            status: "resolved",
            upvotes: 128,
            timeAgo: "5 days ago",
        },
    ];

    const trendingIssues = [
        {
            id: 1,
            title: "Broken Street Light at 5th Cross Road",
            updates: 12,
            status: "inProgress",
            upvotes: 136,
            coordinates: [12.9279, 77.6271],
            location: "Koramangala 5th Block",
        },
        {
            id: 2,
            title: "Garbage Collection Issue",
            updates: 8,
            status: "verified",
            upvotes: 89,
            coordinates: [12.9147, 77.6497],
            location: "HSR Layout Sector 2",
        },
        {
            id: 3,
            title: "Water Supply Disruption",
            updates: 15,
            status: "resolved",
            upvotes: 245,
            coordinates: [12.9719, 77.6412],
            location: "Indiranagar 12th Main",
        },
    ];

    const dummyUsers = [
        "Sanjay Patel",
        "Anita Sharma",
        "Dev Kumar",
        "Meena Rao",
        "Vikram Singh",
        "Neha Gupta",
        "Raj Malhotra",
        "Deepa Jain",
        "Prakash Nair",
        "Arjun Reddy",
    ];

    // Format relative time
    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = Math.floor((now - time) / (1000 * 60));

        if (diff < 60) return `${diff} minutes ago`;
        if (diff < 60 * 24) return `${Math.floor(diff / 60)} hours ago`;
        return `${Math.floor(diff / (60 * 24))} days ago`;
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case "inProgress":
                return "bg-amber-500";
            case "verified":
                return "bg-blue-500";
            case "resolved":
                return "bg-green-500";
            case "highPriority":
                return "bg-red-500";
            default:
                return "bg-gray-300";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "inProgress":
                return "In Progress";
            case "verified":
                return "Verified";
            case "resolved":
                return "Resolved";
            case "highPriority":
                return "High Priority";
            case "verification":
                return "Verification";
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    // Handle post upvote
    const handleUpvote = async (issueId) => {
        console.log(JSON.parse(localStorage.getItem("user")).userId);
        JSON.parse(localStorage.getItem("user")).userId;
        await apiClient
            .post(`/issues/${issueId}/upvote`, {
                userId: JSON.parse(localStorage.getItem("user")).id,
            })
            .then((res) => {
                console.log(res);
                fetchIssues();
            })
            .catch((error) => {
                console.error("Error upvoting:", error);
            });
    };

    // Handle comment upvote
    const handleCommentUpvote = (commentId, currentUpvotes) => {
        setCommentUpvoted((prev) => {
            const newState = { ...prev };
            newState[commentId] = !prev[commentId];
            return newState;
        });
    };

    // Get random upvoters text
    const getUpvotersText = (count) => {
        const randomUsers = [];
        const usersToShow = Math.min(3, count);

        for (let i = 0; i < usersToShow; i++) {
            const randomIndex = Math.floor(Math.random() * dummyUsers.length);
            randomUsers.push(dummyUsers[randomIndex]);
        }

        if (count <= 3) {
            return randomUsers.join(", ") + " upvoted this";
        } else {
            return (
                randomUsers.join(", ") + ` and ${count - 3} others upvoted this`
            );
        }
    };

    // Get progress percentage based on status
    const getProgressPercentage = (status) => {
        switch (status) {
            case "reported":
                return 20;
            case "verified":
                return 40;
            case "inProgress":
                return 60;
            case "resolved":
                return 80;
            case "closed":
                return 100;
            default:
                return 0;
        }
    };

    const visibleComments = expandedComments
        ? currentIssue.comments
        : currentIssue.comments.slice(0, 2);

    // Handle post issue modal
    const handlePostIssueClick = () => {
        setShowPostIssueModal(true);
        getUserLocation(); // Get user location when opening the modal
    };

    const handleClosePostIssueModal = () => {
        setShowPostIssueModal(false);
    };

    // Get user's current location
    const getUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            return;
        }

        setIsLoadingLocation(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                setIsLoadingLocation(false);
            },
            (error) => {
                setLocationError(
                    "Unable to retrieve your location: " + error.message
                );
                setIsLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    // Enhanced MapModal component with OpenStreetMap
    const MapModal = () => {
        if (!selectedIssue || !selectedIssue.coordinates) return null;

        useEffect(() => {
            let map = null;
            const coordinates = selectedIssue.location;

            // Validate coordinates
            if (
                !coordinates ||
                !Array.isArray(coordinates.coordinates.coordinates) ||
                coordinates.coordinates.coordinates.length !== 2 ||
                !isFinite(coordinates.coordinates.coordinates[1]) ||
                !isFinite(coordinates.coordinates.coordinates[0])
            ) {
                console.error("Invalid coordinates:", coordinates);
                return;
            }

            // Check if map container exists
            const container = document.getElementById("map");
            if (!container) return;

            try {
                // Initialize map
                map = L.map("map").setView(
                    [
                        coordinates.coordinates.coordinates[1],
                        coordinates.coordinates.coordinates[0],
                    ],
                    16
                );
                console.log(coordinates);

                L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        attribution: "© OpenStreetMap contributors",
                    }
                ).addTo(map);

                // Add marker
                L.marker([
                    coordinates.coordinates.coordinates[1],
                    coordinates.coordinates.coordinates[0],
                ])
                    .addTo(map)
                    .bindPopup(selectedIssue.title)
                    .openPopup();

                // Cleanup on unmount
                return () => {
                    if (map) {
                        map.remove();
                    }
                };
            } catch (error) {
                console.error("Error initializing map:", error);
            }
        }, [selectedIssue]);

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center">
                            <h3 className="text-lg font-bold text-gray-800">
                                Issue Location
                            </h3>
                            <span className="ml-2 text-sm text-gray-500">
                                {typeof selectedIssue.location === "string"
                                    ? selectedIssue.location
                                    : selectedIssue.location?.area ||
                                      selectedIssue.location?.address}
                            </span>
                        </div>
                        <button
                            onClick={() => setShowMapModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <XIcon size={20} />
                        </button>
                    </div>
                    <div className="p-6">
                        {/* Map container */}
                        <div
                            id="map"
                            className="h-[400px] rounded-lg overflow-hidden"
                        />

                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-gray-800">
                                    Issue Location
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {typeof selectedIssue.location === "string"
                                        ? selectedIssue.location
                                        : `${
                                              selectedIssue.location?.address ||
                                              ""
                                          }, ${
                                              selectedIssue.location?.area || ""
                                          }`}
                                </p>
                            </div>
                            <a
                                href={`https://www.openstreetmap.org/directions?from=&to=${selectedIssue.coordinates.coordinates[1]}%2C${selectedIssue.coordinates.coordinates[0]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all"
                            >
                                Get Directions
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render issues from API data
    const renderIssues = () => {
        if (issues.length === 0 && !isLoading) {
            return (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <div className="text-gray-400 mb-2">
                        <InfoIcon size={32} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">
                        No Issues Found
                    </h3>
                    <p className="text-gray-500">
                        There are no issues to display at this time.
                    </p>
                </div>
            );
        }

        return issues.map((issue, index) => (
            <div
                key={issue._id || index}
                className="bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md mb-4"
            >
                <div className="flex justify-between items-start p-4 border-b border-gray-100">
                    <div className="flex items-center">
                        <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm mr-3 shadow-sm">
                            {issue.reportedBy?.username?.substring(0, 2) ||
                                "??"}
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <div className="font-bold text-gray-800">
                                    {issue.reportedBy?.username || "Anonymous"}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {issue.location?.address || "Unknown location"}
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                                issue.status
                            )} text-white`}
                        >
                            {getStatusText(issue.status)}
                        </span>
                    </div>
                </div>

                {issue.photos && issue.photos.length > 0 ? (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg mx-4 my-4">
                        <img
                            crossOrigin="anonymous"
                            src={
                                apiClient.defaults.baseURL +
                                    `/${issue.photos[0]}` || ""
                            }
                            alt={issue.title}
                            className="w-full h-full object-cover transition-transform duration-300"
                        />
                        {issue.photos.length > 1 && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                                1/{issue.photos.length}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg mx-4 my-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <div className="text-4xl mb-2">🖼️</div>
                            <div className="text-sm font-medium">
                                No Image Available
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="inline-block text-xs font-medium px-2 py-1 rounded-md bg-blue-100 text-blue-600">
                            {issue.category?.toUpperCase() || "UNCATEGORIZED"}
                        </span>

                        <button
                            onClick={() => {
                                setSelectedIssue({
                                    ...issue,
                                    coordinates: issue.location
                                        ?.coordinates || [12.9279, 77.6271],
                                });
                                setShowMapModal(true);
                            }}
                            className="text-xs px-2 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 flex items-center gap-1"
                        >
                            <MapIcon size={12} />
                            View on Map
                        </button>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                        {issue.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                        {issue.description}
                    </p>

                    <div className="text-xs text-gray-500 mb-1">
                        Reported:{" "}
                        {new Date(issue.createdAt).toLocaleDateString()} •
                        Updated:{" "}
                        {new Date(issue.updatedAt).toLocaleDateString()} • ID: #
                        {issue._id}
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                        Assigned to:{" "}
                        {issue.assignedTo?.name || "Not assigned yet"}
                    </div>

                    {/* Upvote Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => handleUpvote(issue._id)}
                            className="flex items-center px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 group"
                        >
                            <ArrowUpIcon
                                size={20}
                                className="mr-2 text-gray-500 group-hover:text-blue-600 group-hover:scale-110 transform transition-transform duration-300"
                            />
                            <span className="font-medium text-gray-600 group-hover:text-blue-600">
                                {issue.upvotes || 0} upvotes
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        ));
    };

    // Add handleLogout function after other handler functions
    const handleLogout = () => {
        // Clear tokens and user data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to home page
        navigate("/");
    };

    // Update the header section to include the dropdown menu
    const renderHeader = () => (
        <div className="bg-blue-600 py-3 px-4 flex justify-between items-center text-white shadow-md transition-all duration-300">
            <div className="flex items-center">
                <div className="bg-white text-blue-600 p-2 rounded-lg mr-2">
                    <Zap size={20} />
                </div>
                <div className="font-bold text-xl">PeopleVoice</div>
            </div>
            <div className="flex items-center space-x-3">
                <button
                    onClick={handlePostIssueClick}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 shadow-sm transition-all font-medium"
                >
                    <PlusIcon size={20} />
                    <span>Post Issue</span>
                </button>

                <div className="relative">
                    <button
                        className="flex items-center space-x-1 p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                        onClick={() =>
                            setShowProfileDropdown(!showProfileDropdown)
                        }
                    >
                        <UserCircleIcon size={24} />
                    </button>
                    {showProfileDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Update the mobile footer to use the new function
    const renderMobileFooter = () => (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-lg">
            <button className="p-2 text-gray-500">
                <MapIcon size={24} />
            </button>
            <button
                onClick={handlePostIssueClick}
                className="p-2 bg-blue-600 text-white rounded-full transform -translate-y-4 shadow-lg"
            >
                <PlusIcon size={24} />
            </button>
            <button className="p-2 text-gray-500">
                <BellIcon size={24} />
            </button>
            <button className="p-2 text-gray-500">
                <UserCircleIcon size={24} />
            </button>
        </div>
    );

    return (
        <div className="font-sans bg-gray-100 min-h-screen">
            {renderHeader()}
            {/* Mobile Tabs */}
            {isMobile && (
                <div className="flex justify-around bg-white border-b border-gray-200 shadow-sm">
                    <button
                        className={`px-4 py-3 text-sm font-medium ${
                            activeTab === "feed"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("feed")}
                    >
                        Issues Feed
                    </button>
                    <button
                        className={`px-4 py-3 text-sm font-medium ${
                            activeTab === "similar"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("similar")}
                    >
                        Similar Issues
                    </button>
                    <button
                        className={`px-4 py-3 text-sm font-medium ${
                            activeTab === "trending"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("trending")}
                    >
                        Trending
                    </button>
                </div>
            )}

            <div className="flex px-4 py-5 gap-5">
                {/* Left sidebar - visible only on desktop */}
                {!isMobile && (
                    <div className="w-48 hidden md:block">
                        <div className="bg-white rounded-lg shadow-sm mb-4 transition-all duration-300 hover:shadow-md">
                            <div className="flex flex-col items-center p-4 border-b border-gray-100">
                                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-2 shadow-sm">
                                    {profile.avatar}
                                </div>
                                <div className="font-bold text-gray-800">
                                    {profile.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {profile.location}
                                </div>
                            </div>
                            <div className="flex flex-col text-sm">
                                <a
                                    href="#"
                                    className="px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 transition-colors"
                                >
                                    <ChevronLeftIcon size={16} />
                                    <span>Issues Feed</span>
                                </a>
                                <button
                                    onClick={() => navigate("/my-reports")}
                                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                >
                                    <UserCircleIcon size={16} />
                                    <span>My Reports</span>
                                </button>
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                >
                                    <UserCircleIcon size={16} />
                                    <span>Profile</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Middle content */}
                {(!isMobile || activeTab === "feed") && (
                    <div className="flex-1 transition-all duration-500 md:pr-48">
                        {/* Loading and Error States */}
                        {isLoading && (
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                                <p className="text-gray-600">
                                    Loading issues...
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm p-4 mb-4">
                                <p className="flex items-center">
                                    <XIcon size={16} className="mr-2" />
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Render issues from API */}
                        {!isLoading && !error && renderIssues()}

                        {/* If no issues are available and not loading, show the original hardcoded issue as fallback */}
                        {!isLoading && !error && issues.length === 0 && (
                            <div className="relative aspect-[16/9] overflow-hidden rounded-lg mx-4 my-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                    <div className="text-4xl mb-2">🖼️</div>
                                    <div className="text-sm font-medium">
                                        Issue Image
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Trending section - only visible on mobile when that tab is active */}
                {isMobile && activeTab === "trending" && (
                    <div className="w-full transition-all duration-500 md:pr-48">
                        <div className="bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                            <div className="p-3 border-b border-gray-100">
                                <h3 className="font-medium text-gray-700">
                                    Trending in Your Area
                                </h3>
                            </div>
                            <div className="p-3">
                                {trendingIssues.map((issue, index) => (
                                    <div
                                        key={index}
                                        className="mb-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <div className="font-medium text-gray-800">
                                            {issue.title}
                                        </div>
                                        <div className="flex text-xs text-gray-500 mt-2">
                                            <span>{issue.updates} updates</span>
                                            <span className="mx-1">•</span>
                                            <span
                                                className={`${getStatusColor(
                                                    issue.status
                                                )} text-white px-1.5 py-0.5 rounded text-xs`}
                                            >
                                                {getStatusText(issue.status)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {issue.upvotes} upvotes
                                        </div>
                                        {/* Add upvoters info for trending issues */}
                                        <div className="text-xs text-gray-400 mt-1 italic">
                                            {getUpvotersText(issue.upvotes)}
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center mt-2">
                                    <a
                                        href="#"
                                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        View all trending issues
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Post Issue Modal */}
            {showPostIssueModal && (
                <PostIssueModal
                    showPostIssueModal={showPostIssueModal}
                    onClose={handleClosePostIssueModal}
                    userLocation={userLocation}
                    setUserLocation={setUserLocation}
                />
            )}
            {showMapModal && <MapModal />}
            {isMobile && renderMobileFooter()}
        </div>
    );
};

export default CitizenFeed;
