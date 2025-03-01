import apiClient from "../../services/api.config";
import React, { useEffect, useState } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MapPinIcon,
    InfoIcon,
    HistoryIcon,
    MapIcon,
    CogIcon,
    UserCircleIcon,
    HomeIcon,
    BellIcon,
    FilterIcon,
    SearchIcon,
    PlusIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostIssueModal from "./components/NewPostModal";

const MyReports = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("all");
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPostIssueModal, setShowPostIssueModal] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);

    // Dummy data for reports
    const reports = [
        {
            id: 1,
            title: "Street Light Malfunction",
            category: "INFRASTRUCTURE",
            status: "in-progress",
            location: "Koramangala 5th Block",
            coordinates: [12.9279, 77.6271],
            reportedDate: "April 15, 2024",
            updatedDate: "April 18, 2024",
            description:
                "Street light has been non-functional for the past week causing safety concerns.",
            upvotes: 23,
            comments: 8,
        },
        {
            id: 2,
            title: "Garbage Collection Issue",
            category: "SANITATION",
            status: "verified",
            location: "HSR Layout Sector 2",
            coordinates: [12.9147, 77.6497],
            reportedDate: "April 12, 2024",
            updatedDate: "April 16, 2024",
            description:
                "Regular garbage collection has been inconsistent in the area.",
            upvotes: 45,
            comments: 12,
        },
        {
            id: 3,
            title: "Water Supply Disruption",
            category: "PLUMBING",
            status: "resolved",
            location: "Indiranagar 12th Main",
            coordinates: [12.9719, 77.6412],
            reportedDate: "April 10, 2024",
            updatedDate: "April 15, 2024",
            description:
                "Frequent water supply disruptions affecting the entire street.",
            upvotes: 67,
            comments: 15,
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "in-progress":
                return "bg-amber-500";
            case "verified":
                return "bg-blue-500";
            case "resolved":
                return "bg-green-500";
            case "pending":
                return "bg-gray-500";
            default:
                return "bg-gray-500";
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case "INFRASTRUCTURE":
                return "bg-blue-100 text-blue-600";
            case "SANITATION":
                return "bg-green-100 text-green-600";
            case "PLUMBING":
                return "bg-purple-100 text-purple-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const fetchIssuesOfUser = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get("/issues/").then((res) => {
                console.log("Fetched User issues:", res.issues);
                const userId = JSON.parse(localStorage.getItem("user")).id;

                // Filter issues reported by the logged-in user
                const userIssues = res.issues.filter(
                    (issue) => issue.reportedBy.userId === userId
                );
                console.log("User issues:", userIssues);

                setIssues(userIssues);
            });

            return response;
        } catch (err) {
            console.error("Error fetching issues:", err);
            setError("Failed to fetch issues. Please try again later.");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIssuesOfUser();
    }, []);

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

    // Handle post issue modal
    const handlePostIssueClick = () => {
        setShowPostIssueModal(true);
        getUserLocation();
    };

    const handleClosePostIssueModal = () => {
        setShowPostIssueModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {showMapModal && <MapModal />}
            {showPostIssueModal && (
                <PostIssueModal
                    showPostIssueModal={showPostIssueModal}
                    onClose={handleClosePostIssueModal}
                    userLocation={userLocation}
                    setUserLocation={setUserLocation}
                />
            )}

            {/* Header */}
            <div className="bg-blue-600 py-3 px-4 flex justify-between items-center text-white shadow-md">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                        <ChevronLeftIcon size={20} />
                    </button>
                    <div className="font-bold text-xl">My Reports</div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handlePostIssueClick}
                        className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                    >
                        <PlusIcon size={20} />
                        <span>Add A New Report</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Search and Filters */}
                <div className="flex space-x-4 mb-6">
                    <div className="flex-1 relative">
                        <SearchIcon
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Reports List */}
                <div className="space-y-4">
                    {issues.map((report) => (
                        <div
                            key={report._id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span
                                            className={`text-xs font-medium px-2 py-1 rounded-md ${getCategoryColor(
                                                report.category
                                            )}`}
                                        >
                                            {report.category}
                                        </span>
                                        <h3 className="text-lg font-medium text-gray-800 mt-2">
                                            {report.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {report.description}
                                        </p>
                                        <div className="flex items-center text-sm text-gray-500 mt-2">
                                            <MapPinIcon
                                                size={16}
                                                className="mr-1"
                                            />
                                            {report.address}
                                        </div>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                            report.status
                                        )} text-white`}
                                    >
                                        {report.status
                                            .split("-")
                                            .map(
                                                (word) =>
                                                    word
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    word.slice(1)
                                            )
                                            .join(" ")}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>{report.upvotes} upvotes</span>
                                        <span>•</span>
                                        <span>{report.comments} comments</span>
                                        <span>•</span>
                                        <span>
                                            Reported: {report.reportedDate}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                                            <InfoIcon
                                                size={16}
                                                className="mr-2"
                                            />
                                            View Details
                                        </button>
                                        <button className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                                            <HistoryIcon
                                                size={16}
                                                className="mr-2"
                                            />
                                            Track Progress
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 md:hidden">
                <div className="flex justify-around">
                    <button
                        onClick={() => navigate("/feed")}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <HomeIcon size={24} />
                    </button>
                    <button
                        onClick={() => navigate("/map")}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <MapIcon size={24} />
                    </button>
                    <button className="p-2 text-blue-600">
                        <UserCircleIcon size={24} />
                    </button>
                    <button
                        onClick={() => navigate("/notifications")}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <BellIcon size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyReports;
