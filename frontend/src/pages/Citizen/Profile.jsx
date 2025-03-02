import React, { useEffect, useState } from "react";
import apiClient from "../../services/api.config";
import {
    ArrowUpIcon,
    ChevronLeftIcon,
    MapPinIcon,
    TrophyIcon,
    StarIcon,
    HistoryIcon,
    SettingsIcon,
    ThumbsUpIcon,
    MessageCircleIcon,
    BellIcon,
    HomeIcon,
    UserCircleIcon,
    MapIcon,
    CogIcon,
    ChevronRightIcon,
    HeartIcon,
    FireExtinguisher,
    PlusIcon,
    XIcon,
    InfoIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [upvotedComments, setUpvotedComments] = useState({});
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showPostIssueModal, setShowPostIssueModal] = useState(false);
    const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);
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

    // Dummy user data
    const userData = {
        name: "Citizen",
        location: "Nadiad",
        avatar: "C",
        points: 3580,
        joinedDate: "January 2024",
        totalReports: 42,
        resolvedIssues: 28,
        badges: [
            {
                name: "Community Champion",
                icon: "🏆",
                description: "Contributed to 25+ resolved issues",
                date: "March 2024",
            },
            {
                name: "First Responder",
                icon: "⚡",
                description: "Quick response to critical issues",
                date: "February 2024",
            },
            {
                name: "Problem Solver",
                icon: "🎯",
                description: "Successfully resolved 10 issues",
                date: "February 2024",
            },
            {
                name: "Local Hero",
                icon: "⭐",
                description: "Most active user in Koramangala",
                date: "March 2024",
            },
        ],
        recentActivity: [
            {
                type: "report",
                title: "Reported street light issue",
                date: "2 days ago",
                status: "in-progress",
                upvotes: 45,
                comments: 12,
                isUpvoted: true,
            },
            {
                type: "comment",
                title: "Commented on water supply issue",
                date: "3 days ago",
                status: "resolved",
                upvotes: 32,
                comments: 8,
                isUpvoted: false,
            },
            {
                type: "upvote",
                title: "Upvoted road repair request",
                date: "4 days ago",
                status: "verified",
                upvotes: 89,
                comments: 24,
                isUpvoted: true,
            },
        ],
        comments: [
            {
                id: 1,
                text: "The street light has been non-functional for over a week now. This is a serious safety hazard.",
                date: "2 days ago",
                upvotes: 30,
                issue: "Street Light Issue",
                isUpvoted: false,
                replies: 5,
                isHot: true,
            },
            {
                id: 2,
                text: "Water supply has been irregular in our area. Please look into this urgently.",
                date: "3 days ago",
                upvotes: 25,
                issue: "Water Supply Issue",
                isUpvoted: true,
                replies: 3,
                isHot: false,
            },
            {
                id: 3,
                text: "The pothole on 5th cross is getting bigger. Need immediate attention.",
                date: "4 days ago",
                upvotes: 42,
                issue: "Road Repair",
                isUpvoted: false,
                replies: 8,
                isHot: true,
            },
        ],
        popularComments: [
            {
                id: 4,
                text: "The garbage collection timing needs to be more consistent. Current irregular timings are causing issues.",
                date: "1 week ago",
                upvotes: 156,
                issue: "Garbage Collection",
                isUpvoted: true,
                replies: 15,
                isHot: true,
            },
            {
                id: 5,
                text: "Traffic signal at the main junction has been malfunctioning during peak hours.",
                date: "5 days ago",
                upvotes: 98,
                issue: "Traffic Management",
                isUpvoted: false,
                replies: 12,
                isHot: true,
            },
        ],
        trendingIssues: [
            {
                title: "Water Supply Disruption",
                upvotes: 210,
                status: "highPriority",
                updates: 26,
            },
            {
                title: "Garbage Collection Delay",
                upvotes: 186,
                status: "in-progress",
                updates: 18,
            },
            {
                title: "Road Pothole Repairs",
                upvotes: 142,
                status: "verification",
                updates: 14,
            },
        ],
        issues: [
            {
                id: 1,
                title: "Improper Waste Disposal at Koramangala Park",
                category: "ENVIRONMENTAL",
                status: "in-progress",
                location: "Koramangala 3rd Block Park, Bangalore",
                reportedDate: "April 10, 2024",
                updatedDate: "April 15, 2024",
                upvotes: 18,
                comments: 7,
                description:
                    "Large amounts of waste being dumped near the park entrance. This needs immediate attention.",
            },
            {
                id: 2,
                title: "Damaged Road at 80 Feet Road Junction",
                category: "INFRASTRUCTURE",
                status: "verified",
                location:
                    "80 Feet Road and 100 Feet Road Junction, Koramangala",
                reportedDate: "March 25, 2024",
                updatedDate: "April 8, 2024",
                upvotes: 37,
                comments: 12,
                description:
                    "Major road damage causing traffic congestion and safety hazards.",
            },
            {
                id: 3,
                title: "Leaking Pipe in Public Bathroom",
                category: "PLUMBING",
                status: "resolved",
                location: "Koramangala 6th Block",
                reportedDate: "April 18, 2024",
                updatedDate: "April 20, 2024",
                upvotes: 15,
                comments: 5,
                description:
                    "Water leakage in public restroom causing wastage and hygiene issues.",
            },
        ],
    };

    // Handle upvote
    const handleUpvote = (commentId) => {
        setUpvotedComments((prev) => {
            const newState = { ...prev };
            newState[commentId] = !newState[commentId];
            return newState;
        });
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "in-progress":
                return "bg-amber-500";
            case "verified":
                return "bg-blue-500";
            case "resolved":
                return "bg-green-500";
            case "highPriority":
                return "bg-red-500";
            case "verification":
                return "bg-purple-500";
            default:
                return "bg-gray-300";
        }
    };

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case "in-progress":
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

    // Get category color
    const getCategoryColor = (category) => {
        switch (category.toLowerCase()) {
            case "environmental":
                return "bg-green-100 text-green-600";
            case "infrastructure":
                return "bg-orange-100 text-orange-600";
            case "plumbing":
                return "bg-blue-100 text-blue-600";
            case "electrical":
                return "bg-yellow-100 text-yellow-600";
            case "sanitation":
                return "bg-purple-100 text-purple-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    // Post Issue Modal
    const PostIssueModal = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Report New Issue
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Fill in the details below to report a public issue
                    </p>
                </div>

                {/* Modal Content */}
                <div className="px-8 py-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Issue Type - Hidden as it's always "public" */}
                        <input type="hidden" value="public" />

                        {/* Category Selection */}
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
                                        className="flex items-center px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <InfoIcon
                                                category={cat}
                                                className="text-blue-600"
                                                size={18}
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

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter a clear title for the issue"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                rows="4"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Provide detailed description of the issue"
                            ></textarea>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location
                            </label>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter address"
                                />
                                <div className="h-40 bg-gray-100 rounded-lg relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MapIcon
                                            size={24}
                                            className="text-gray-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-500">
                                            Map will be displayed here
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Latitude"
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Longitude"
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Area Code (Optional)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Photos - Adjusted size */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Photos
                            </label>
                            <div className="grid grid-cols-4 gap-3">
                                {[1, 2, 3, 4].map((index) => (
                                    <div
                                        key={index}
                                        className="aspect-square w-full max-w-[120px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all"></div>
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 group-hover:bg-blue-200 transition-all transform group-hover:scale-110">
                                            <PlusIcon
                                                size={16}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600">
                                            Photo {index}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center">
                                <InfoIcon size={14} className="mr-1" />
                                Upload up to 4 photos (Max 5MB each)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 rounded-b-2xl flex justify-end space-x-3">
                    <button
                        onClick={() => setShowPostIssueModal(false)}
                        className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-200 font-medium transition-all focus:ring-2 focus:ring-gray-300"
                    >
                        Cancel
                    </button>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transform hover:scale-105">
                        Post Issue
                    </button>
                </div>
            </div>
        </div>
    );

    // View Details Modal
    const ViewDetailsModal = () => {
        if (!selectedIssue) return null;

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
                <div className="my-8 bg-white rounded-2xl w-full max-w-3xl shadow-2xl transform transition-all scale-100 animate-slideIn">
                    <div className="px-8 py-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span
                                    className={`text-xs font-medium px-2 py-1 rounded-md ${getCategoryColor(
                                        selectedIssue.category
                                    )}`}
                                >
                                    {selectedIssue.category}
                                </span>
                                <h2 className="text-xl font-bold text-gray-800 mt-2">
                                    {selectedIssue.title}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Issue #{selectedIssue.id}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                        selectedIssue.status
                                    )} text-white`}
                                >
                                    {getStatusText(selectedIssue.status)}
                                </span>
                                <button
                                    onClick={() =>
                                        setShowViewDetailsModal(false)
                                    }
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XIcon size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium text-gray-800 mb-2">
                                    Description
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {selectedIssue.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-800 mb-2">
                                    Location
                                </h3>
                                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-2">
                                    Map View
                                </div>
                                <p className="text-sm text-gray-600">
                                    {selectedIssue.location}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-800 mb-2">
                                    Photos
                                </h3>
                                <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden group">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-full bg-gray-200"></div>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <button className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-all">
                                        <ChevronLeftIcon size={20} />
                                    </button>
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-all">
                                        <ChevronRightIcon size={20} />
                                    </button>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded-full text-white text-xs">
                                        1/3
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-800 mb-2">
                                    Timeline
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-800">
                                                Issue Reported
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {selectedIssue.reportedDate}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-green-600"></div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-800">
                                                Last Updated
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {selectedIssue.updatedDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 rounded-b-2xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{selectedIssue.upvotes} upvotes</span>
                                <span>•</span>
                                <span>{selectedIssue.comments} comments</span>
                            </div>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                                    Track Progress
                                </button>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                                    View on Map
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {showPostIssueModal && <PostIssueModal />}
            {showViewDetailsModal && <ViewDetailsModal />}

            {/* Header */}
            <div className="bg-blue-600 py-3 px-4 flex justify-between items-center text-white shadow-md transition-all duration-300">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                    >
                        <ChevronLeftIcon size={20} />
                    </button>
                    <div className="font-bold text-xl">Profile</div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowPostIssueModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 shadow-sm transition-all font-medium"
                    >
                        <PlusIcon size={20} />
                        <span>Post Issue</span>
                    </button>
                    <button className="p-2 rounded-full hover:bg-blue-700 transition-colors duration-200">
                        <CogIcon size={20} />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() =>
                                setShowProfileDropdown(!showProfileDropdown)
                            }
                            className="p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                        >
                            <CogIcon size={20} />
                        </button>

                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 transition-all duration-200">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Account Settings
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Privacy Settings
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Notification Preferences
                                </a>
                                <div className="border-t border-gray-200 mt-1 pt-1">
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Sign Out
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2 py-6">
                {/* Profile Header - Enhanced */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 transform hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold mr-6 shadow-md">
                                {userData.avatar}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {userData.name}
                                </h1>
                                <div className="flex items-center text-gray-600 mt-1">
                                    <MapPinIcon size={16} className="mr-1" />
                                    <span>{userData.location}</span>
                                </div>
                                <div className="flex items-center mt-3 space-x-6">
                                    <div className="text-sm">
                                        <span className="text-gray-500">
                                            Member since
                                        </span>
                                        <span className="ml-1 font-medium">
                                            {userData.joinedDate}
                                        </span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">
                                            Total Reports
                                        </span>
                                        <span className="ml-1 font-medium">
                                            {userData.totalReports}
                                        </span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">
                                            Resolved
                                        </span>
                                        <span className="ml-1 font-medium">
                                            {userData.resolvedIssues}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-md">
                            <div className="text-sm">Reputation Points</div>
                            <div className="text-2xl font-bold">
                                {userData.points}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs - Enhanced */}
                <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            activeTab === "overview"
                                ? "bg-blue-600 text-white shadow-md transform scale-105"
                                : "bg-transparent text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("issues")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            activeTab === "issues"
                                ? "bg-blue-600 text-white shadow-md transform scale-105"
                                : "bg-transparent text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Issues
                    </button>
                    <button
                        onClick={() => setActiveTab("badges")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            activeTab === "badges"
                                ? "bg-blue-600 text-white shadow-md transform scale-105"
                                : "bg-transparent text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Badges & Rewards
                    </button>
                    <button
                        onClick={() => setActiveTab("activity")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            activeTab === "activity"
                                ? "bg-blue-600 text-white shadow-md transform scale-105"
                                : "bg-transparent text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Activity History
                    </button>
                    <button
                        onClick={() => setActiveTab("trending")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            activeTab === "trending"
                                ? "bg-blue-600 text-white shadow-md transform scale-105"
                                : "bg-transparent text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        Trending Issues
                    </button>
                </div>

                {/* Content Sections */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Quick Stats */}
                        <div className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                                <div className="text-sm text-gray-500">
                                    Total Issues
                                </div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {userData.issues.length}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    Across all categories
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                                <div className="text-sm text-gray-500">
                                    Active Issues
                                </div>
                                <div className="text-2xl font-bold text-amber-600">
                                    {
                                        userData.issues.filter(
                                            (i) => i.status === "in-progress"
                                        ).length
                                    }
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    Currently in progress
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                                <div className="text-sm text-gray-500">
                                    Resolved Issues
                                </div>
                                <div className="text-2xl font-bold text-green-600">
                                    {
                                        userData.issues.filter(
                                            (i) => i.status === "resolved"
                                        ).length
                                    }
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    Successfully completed
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                                <div className="text-sm text-gray-500">
                                    Total Upvotes
                                </div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {userData.issues.reduce(
                                        (acc, i) => acc + i.upvotes,
                                        0
                                    )}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    Community support
                                </div>
                            </div>
                        </div>

                        {/* Recent Issues */}
                        <div className="col-span-3 md:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Recent Issues
                                    </h2>
                                    <button
                                        onClick={() => setActiveTab("issues")}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {userData.issues
                                        .slice(0, 2)
                                        .map((issue, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-all"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-xs font-medium px-2 py-1 rounded-md bg-blue-100 text-blue-600">
                                                            {issue.category}
                                                        </span>
                                                        <h3 className="font-medium text-gray-800 mt-2">
                                                            {issue.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {issue.description}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                                            issue.status
                                                        )} text-white`}
                                                    >
                                                        {getStatusText(
                                                            issue.status
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                                    <span>
                                                        {issue.upvotes} upvotes
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {issue.comments}{" "}
                                                        comments
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {issue.reportedDate}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Links & Stats */}
                        <div className="col-span-3 md:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">
                                    Quick Stats
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-600">
                                            Response Rate
                                        </span>
                                        <span className="text-sm font-medium text-green-600">
                                            92%
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-600">
                                            Avg. Resolution Time
                                        </span>
                                        <span className="text-sm font-medium text-blue-600">
                                            3.2 days
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-600">
                                            Community Rank
                                        </span>
                                        <span className="text-sm font-medium text-purple-600">
                                            #12
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Existing Overview Content */}
                        <div className="col-span-3 md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg shadow-sm p-6 transform hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                            <TrophyIcon
                                                size={18}
                                                className="mr-2 text-amber-500"
                                            />
                                            Recent Badges
                                        </h2>
                                        <span className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 hover:underline">
                                            View All
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        {userData.badges
                                            .slice(0, 2)
                                            .map((badge, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg transform hover:scale-102 hover:shadow-md transition-all duration-300"
                                                >
                                                    <div className="text-3xl mr-4">
                                                        {badge.icon}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-800">
                                                            {badge.name}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {badge.description}
                                                        </div>
                                                        <div className="text-xs text-blue-600 mt-1">
                                                            Earned {badge.date}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-sm p-6 transform hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                            <MessageCircleIcon
                                                size={18}
                                                className="mr-2 text-blue-500"
                                            />
                                            Popular Comments
                                        </h2>
                                        <span className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 hover:underline">
                                            View All
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        {userData.popularComments.map(
                                            (comment, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300"
                                                >
                                                    <div className="text-sm text-gray-800 mb-2">
                                                        {comment.text}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="text-xs text-gray-500">
                                                                <span className="font-medium text-blue-600">
                                                                    {
                                                                        comment.issue
                                                                    }
                                                                </span>
                                                                <span className="mx-2">
                                                                    •
                                                                </span>
                                                                <span>
                                                                    {
                                                                        comment.date
                                                                    }
                                                                </span>
                                                            </div>
                                                            {comment.isHot && (
                                                                <div className="flex items-center text-xs text-orange-500">
                                                                    <FireExtinguisher
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="mr-1"
                                                                    />
                                                                    <span>
                                                                        Hot
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex items-center space-x-1 text-gray-500">
                                                                <MessageCircleIcon
                                                                    size={14}
                                                                />
                                                                <span className="text-xs">
                                                                    {
                                                                        comment.replies
                                                                    }
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() =>
                                                                    handleUpvote(
                                                                        comment.id
                                                                    )
                                                                }
                                                                className={`flex items-center space-x-1 group transition-all duration-300 ${
                                                                    upvotedComments[
                                                                        comment
                                                                            .id
                                                                    ] ||
                                                                    comment.isUpvoted
                                                                        ? "text-blue-600"
                                                                        : "text-gray-500 hover:text-blue-600"
                                                                }`}
                                                            >
                                                                <div className="relative">
                                                                    <ThumbsUpIcon
                                                                        size={
                                                                            14
                                                                        }
                                                                        className={`transform transition-all duration-300 ${
                                                                            upvotedComments[
                                                                                comment
                                                                                    .id
                                                                            ] ||
                                                                            comment.isUpvoted
                                                                                ? "scale-125"
                                                                                : "group-hover:scale-110"
                                                                        }`}
                                                                    />
                                                                    {!upvotedComments[
                                                                        comment
                                                                            .id
                                                                    ] &&
                                                                        !comment.isUpvoted && (
                                                                            <div className="absolute -top-2 -right-2 text-xs bg-blue-100 text-blue-600 px-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                +1
                                                                            </div>
                                                                        )}
                                                                </div>
                                                                <span
                                                                    className={`text-xs font-medium transition-all duration-300 ${
                                                                        upvotedComments[
                                                                            comment
                                                                                .id
                                                                        ] ||
                                                                        comment.isUpvoted
                                                                            ? "text-blue-600"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {
                                                                        comment.upvotes
                                                                    }
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "issues" && (
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">
                                All Issues
                            </h2>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setShowPostIssueModal(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                                >
                                    <PlusIcon size={18} />
                                    <span>Post New Issue</span>
                                </button>
                                <select className="text-sm border rounded-lg px-3 py-2">
                                    <option>All Categories</option>
                                    <option>Environmental</option>
                                    <option>Infrastructure</option>
                                    <option>Plumbing</option>
                                </select>
                                <select className="text-sm border rounded-lg px-3 py-2">
                                    <option>All Statuses</option>
                                    <option>In Progress</option>
                                    <option>Verified</option>
                                    <option>Resolved</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {userData.issues.map((issue, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <span
                                                className={`text-xs font-medium px-2 py-1 rounded-md ${getCategoryColor(
                                                    issue.category
                                                )}`}
                                            >
                                                {issue.category}
                                            </span>
                                            <h3 className="text-lg font-medium text-gray-800 mt-2">
                                                {issue.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {issue.description}
                                            </p>
                                            <div className="text-sm text-gray-500 mt-2">
                                                <MapPinIcon
                                                    size={14}
                                                    className="inline mr-1"
                                                />
                                                {issue.location}
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                                issue.status
                                            )} text-white ml-4`}
                                        >
                                            {getStatusText(issue.status)}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex gap-4">
                                        {/* Reduced image size */}
                                        <div className="relative h-32 w-32 bg-gray-100 rounded-lg overflow-hidden group flex-shrink-0">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-full h-full bg-gray-200"></div>
                                            </div>

                                            {/* Navigation Buttons */}
                                            <button className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-all">
                                                <ChevronLeftIcon size={16} />
                                            </button>
                                            <button className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-all">
                                                <ChevronRightIcon size={16} />
                                            </button>

                                            {/* Image Counter */}
                                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/50 rounded-full text-white text-xs">
                                                1/3
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>
                                                        {issue.upvotes} upvotes
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {issue.comments}{" "}
                                                        comments
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        Reported:{" "}
                                                        {issue.reportedDate}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        Updated:{" "}
                                                        {issue.updatedDate}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 mt-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedIssue(issue);
                                                        setShowViewDetailsModal(
                                                            true
                                                        );
                                                    }}
                                                    className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                                                >
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
                                                <button className="text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
                                                    <MapIcon
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    View on Map
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "badges" && (
                    <div className="bg-white rounded-lg shadow-sm p-6 transform hover:shadow-md transition-all duration-300">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                            <TrophyIcon
                                size={18}
                                className="mr-2 text-amber-500"
                            />
                            All Badges
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userData.badges.map((badge, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg transform hover:scale-102 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="text-4xl mr-4">
                                        {badge.icon}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">
                                            {badge.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {badge.description}
                                        </div>
                                        <div className="text-xs text-blue-600 mt-1">
                                            Earned {badge.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                            <h3 className="text-md font-bold text-gray-800 mb-4">
                                Upcoming Badges
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-4">🏅</div>
                                    <div>
                                        <div className="font-medium text-gray-800">
                                            Quality Contributor
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Receive 50+ upvotes on your comments
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: "70%" }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-blue-600 mt-1">
                                            Progress: 35/50 upvotes
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="text-2xl mr-4">🔍</div>
                                    <div>
                                        <div className="font-medium text-gray-800">
                                            Eagle Eye
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Report 10 issues that get verified
                                            by authorities
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: "40%" }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-blue-600 mt-1">
                                            Progress: 4/10 verified reports
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "activity" && (
                    <div className="bg-white rounded-lg shadow-sm p-6 transform hover:shadow-md transition-all duration-300">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                            <HistoryIcon
                                size={18}
                                className="mr-2 text-blue-500"
                            />
                            Activity History
                        </h2>

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="px-4 py-2 bg-blue-50 rounded-lg text-center flex-1">
                                <div className="text-sm text-gray-600">
                                    Total Reports
                                </div>
                                <div className="text-xl font-bold text-blue-600">
                                    {userData.totalReports}
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-green-50 rounded-lg text-center flex-1">
                                <div className="text-sm text-gray-600">
                                    Resolved Issues
                                </div>
                                <div className="text-xl font-bold text-green-600">
                                    {userData.resolvedIssues}
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-amber-50 rounded-lg text-center flex-1">
                                <div className="text-sm text-gray-600">
                                    Success Rate
                                </div>
                                <div className="text-xl font-bold text-amber-600">
                                    {Math.round(
                                        (userData.resolvedIssues /
                                            userData.totalReports) *
                                            100
                                    )}
                                    %
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {userData.recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start">
                                            <div
                                                className={`w-3 h-3 rounded-full mt-1.5 mr-4 ${getStatusColor(
                                                    activity.status
                                                )}`}
                                            />
                                            <div>
                                                <div className="text-gray-800 font-medium">
                                                    {activity.title}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {activity.date}
                                                </div>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <div className="flex items-center space-x-1 text-gray-500">
                                                        <ThumbsUpIcon
                                                            size={14}
                                                        />
                                                        <span className="text-xs">
                                                            {activity.upvotes}{" "}
                                                            upvotes
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-gray-500">
                                                        <MessageCircleIcon
                                                            size={14}
                                                        />
                                                        <span className="text-xs">
                                                            {activity.comments}{" "}
                                                            comments
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                                activity.status
                                            )} text-white`}
                                        >
                                            {getStatusText(activity.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 text-center">
                            <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg">
                                View All Activity
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "trending" && (
                    <div className="bg-white rounded-lg shadow-sm p-6 transform hover:shadow-md transition-all duration-300">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                            <StarIcon
                                size={18}
                                className="mr-2 text-amber-500"
                            />
                            Trending Issues in Your Area
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            {userData.trendingIssues.map((issue, index) => (
                                <div
                                    key={index}
                                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-lg font-medium text-gray-800">
                                                {issue.title}
                                            </div>
                                            <div className="flex items-center mt-2 space-x-3">
                                                <div className="text-sm text-gray-500">
                                                    <span>
                                                        {issue.updates} updates
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <span>
                                                        {issue.upvotes} upvotes
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                                issue.status
                                            )} text-white`}
                                        >
                                            {getStatusText(issue.status)}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-4 mt-4">
                                        <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm transition-colors">
                                            <ArrowUpIcon size={14} />
                                            <span>Upvote</span>
                                        </button>
                                        <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm transition-colors">
                                            <MessageCircleIcon size={14} />
                                            <span>Comment</span>
                                        </button>
                                        <button className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-sm transition-colors">
                                            <MapPinIcon size={14} />
                                            <span>View on Map</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 text-center">
                            <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg">
                                See More Trending Issues
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 md:hidden">
                <div className="flex justify-around">
                    <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <HomeIcon size={24} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <MapIcon size={24} />
                    </button>
                    <button className="p-2 text-blue-600">
                        <UserCircleIcon size={24} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <BellIcon size={24} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <CogIcon size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
