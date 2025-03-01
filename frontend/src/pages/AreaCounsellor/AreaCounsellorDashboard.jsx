import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Activity,
  AlertTriangle,
  ArrowUpIcon,
  BarChart2,
  BellIcon,
  CheckCircle,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock,
  CogIcon,
  FileText,
  Filter,
  Flag,
  Home,
  Info,
  Layout,
  MapIcon,
  MessageCircle,
  Phone,
  PieChart,
  PlusIcon,
  Search,
  Settings,
  Star,
  ThumbsUp,
  TouchpadOff,
  TrendingUp,
  User,
  UserCircleIcon,
  Users,
  XIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { IssueCard, IssueDetailsModal, IssueFilters } from './components/IssueManagement';

const AreaCounsellor = () => {
  const navigate = useNavigate();
  
  // State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueDetailsModal, setIssueDetailsModal] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusUpdateModal, setStatusUpdateModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentUser, setCurrentUser] = useState(null);

  // Dummy Data for Counsellor
  const counsellorData = {
    _id: "AC123456",
    name: "Rajesh Kumar",
    designation: "Area Counsellor",
    area: "Koramangala",
    ward: "Ward 151",
    city: "Bangalore",
    state: "Karnataka",
    contactInfo: {
      email: "rajesh.kumar@bbmp.gov.in",
      phone: "+91 9876543210",
      office: "BBMP Ward Office, 5th Block Koramangala"
    },
    statistics: {
      totalIssues: 456,
      resolvedIssues: 312,
      pendingIssues: 144,
      highPriorityIssues: 28,
      averageResolutionTime: 72, // hours
      satisfactionRate: 85 // percentage
    }
  };

  // Dummy Data for Area Statistics
  const areaStatistics = {
    totalPopulation: 125000,
    totalHouseholds: 32000,
    areaCoverage: 7.5, // sq km
    wardNumber: 151,
    topIssueCategories: [
      { category: 'Infrastructure', count: 156, percentage: 35 },
      { category: 'Sanitation', count: 98, percentage: 22 },
      { category: 'Water Supply', count: 76, percentage: 17 },
      { category: 'Electricity', count: 67, percentage: 15 },
      { category: 'Others', count: 49, percentage: 11 }
    ],
    monthlyTrends: [
      { month: 'Jan', issues: 45, resolved: 38 },
      { month: 'Feb', issues: 52, resolved: 45 },
      { month: 'Mar', issues: 48, resolved: 40 },
      { month: 'Apr', issues: 60, resolved: 52 },
      { month: 'May', issues: 55, resolved: 48 },
      { month: 'Jun', issues: 65, resolved: 55 }
    ]
  };

  // Dummy Issues Data
  const [issues, setIssues] = useState([
    {
      id: "ISS001",
      title: "Broken Street Light at 5th Cross",
      category: "Infrastructure",
      type: "public",
      priority: "high",
      currentPhase: "verification",
      location: "5th Cross, 6th Block",
      reportedBy: {
        name: "Citizen Name",
        id: "CTZ123"
      },
      reportedAt: "2024-03-01",
      deadline: "2024-03-15",
      upvotes: 45,
      comments: 12,
      images: [],
      description: "Street light non-functional for past week causing safety concerns",
      phaseDetails: {
        verification: {
          status: "pending",
          comments: ""
        },
        etaDeadline: {
          status: "pending",
          deadline: null,
          isExtended: false
        },
        resolution: {
          status: "pending",
          comments: "",
          proof: []
        }
      }
    },
    // Add more dummy issues...
  ]);

  // Dummy Notifications
  const [notifications, setNotifications] = useState([
    {
      id: "NOT001",
      type: "new_issue",
      title: "New High Priority Issue Reported",
      description: "Water pipeline leak reported in 4th Block",
      timestamp: "2024-03-04T10:30:00Z",
      read: false
    },
    {
      id: "NOT002",
      type: "status_update",
      title: "Issue Resolution Update",
      description: "Street light repair completed in 7th Block",
      timestamp: "2024-03-04T09:15:00Z",
      read: true
    },
    // Add more notifications...
  ]);

  useEffect(() => {
    // Fetch user info, issues, etc.
  }, []);

  const handlePhaseUpdate = async (issueId, phase, updateData) => {
    try {
      // In real implementation, this would be an API call
      console.log('Updating phase:', { issueId, phase, updateData });
      
      // Update local state for demo
      setIssues(prevIssues => 
        prevIssues.map(issue => {
          if (issue.id === issueId) {
            return {
              ...issue,
              currentPhase: phase === 'verification' && updateData.status === 'verified' ? 'etaDeadline' : phase,
              phaseDetails: {
                ...issue.phaseDetails,
                [phase]: {
                  ...issue.phaseDetails[phase],
                  ...updateData
                }
              }
            };
          }
          return issue;
        })
      );

      setIssueDetailsModal(false);
    } catch (error) {
      console.error('Phase update error:', error);
      // Show error toast
    }
  };

  const handleFilterChange = (filters) => {
    // Implement filtering logic
    console.log('Filters changed:', filters);
  };

  const renderStatisticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
            Total Issues
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{counsellorData.statistics.totalIssues}</h3>
        <p className="text-sm text-gray-500">In your area</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
            Pending
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{counsellorData.statistics.pendingIssues}</h3>
        <p className="text-sm text-gray-500">Need attention</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <span className="text-sm font-medium text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
            High Priority
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{counsellorData.statistics.highPriorityIssues}</h3>
        <p className="text-sm text-gray-500">Critical issues</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
            Resolved
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{counsellorData.statistics.resolvedIssues}</h3>
        <p className="text-sm text-gray-500">Successfully completed</p>
      </div>
    </div>
  );

  const renderPerformanceMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Time</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {counsellorData.statistics.averageResolutionTime}h
            </p>
            <p className="text-sm text-gray-500">Average resolution time</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Satisfaction Rate</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {counsellorData.statistics.satisfactionRate}%
            </p>
            <p className="text-sm text-gray-500">Citizen satisfaction</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderIssuesList = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {issues.map(issue => (
        <IssueCard
          key={issue.id}
          issue={issue}
          onViewDetails={() => {
            setSelectedIssue(issue);
            setIssueDetailsModal(true);
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Area Counsellor Dashboard | CityFix</title>
      </Helmet>
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CityFix</h1>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Area Counsellor
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-500 hover:text-gray-700"
              >
                <BellIcon className="w-6 h-6" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {counsellorData.name[0]}
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                </button>
                
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <a href="#profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <a href="#logout" className="block px-4 py-2 text-red-600 hover:bg-gray-100">Logout</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm border border-gray-200 w-fit">
          {['overview', 'issues', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content */}
        {activeTab === 'overview' && (
          <>
            {renderStatisticsCards()}
            {renderPerformanceMetrics()}
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Issues</h2>
            {renderIssuesList()}
          </>
        )}

        {activeTab === 'issues' && (
          <>
            <IssueFilters onFilterChange={handleFilterChange} />
            {renderIssuesList()}
          </>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                  {counsellorData.name[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{counsellorData.name}</h2>
                  <p className="text-gray-500">{counsellorData.designation}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Area Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-medium">{counsellorData.area}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ward</p>
                      <p className="font-medium">{counsellorData.ward}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium">{counsellorData.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">State</p>
                      <p className="font-medium">{counsellorData.state}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{counsellorData.contactInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{counsellorData.contactInfo.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Office Address</p>
                      <p className="font-medium">{counsellorData.contactInfo.office}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Issues Handled</p>
                      <p className="text-2xl font-bold text-gray-900">{counsellorData.statistics.totalIssues}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Resolution Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round((counsellorData.statistics.resolvedIssues / counsellorData.statistics.totalIssues) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {issueDetailsModal && selectedIssue && (
        <IssueDetailsModal
          issue={selectedIssue}
          onClose={() => {
            setSelectedIssue(null);
            setIssueDetailsModal(false);
          }}
          onPhaseUpdate={handlePhaseUpdate}
        />
      )}
    </div>
  );
};

export default AreaCounsellor;