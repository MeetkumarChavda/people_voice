import React, { useState, useEffect } from 'react';
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

const AreaCounsellor = () => {
  const navigate = useNavigate();
  
  // State Management
  const [activeView, setActiveView] = useState('dashboard');
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
      priority: "high",
      status: "pending",
      location: {
        address: "5th Cross, 6th Block",
        coordinates: [12.9279, 77.6271]
      },
      reportedBy: {
        name: "Citizen Name",
        id: "CTZ123"
      },
      reportedDate: "2024-03-01",
      upvotes: 45,
      comments: 12,
      description: "Street light non-functional for past week causing safety concerns",
      assignedTo: "Electrical Department",
      updates: [
        {
          date: "2024-03-02",
          status: "verified",
          comment: "Issue verified by field officer"
        },
        {
          date: "2024-03-03",
          status: "in-progress",
          comment: "Work order generated"
        }
      ]
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

  // Dashboard Components
  const DashboardHeader = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{counsellorData.name}</h1>
          <p className="text-gray-600">{counsellorData.designation} - {counsellorData.area}</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <MapIcon size={16} className="mr-2" />
            <span>{counsellorData.ward}, {counsellorData.city}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BellIcon size={24} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <UserCircleIcon size={24} />
              <ChevronDownIcon size={16} />
            </button>
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <a href="#profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                <div className="border-t border-gray-200 my-1"></div>
                <a href="#logout" className="block px-4 py-2 text-red-600 hover:bg-gray-100">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const StatisticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-600 text-sm font-medium">Total Issues</h3>
          <FileText size={20} className="text-blue-500" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-800">{counsellorData.statistics.totalIssues}</p>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>
          <div className="text-green-500 text-sm font-medium">+12.5%</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-600 text-sm font-medium">Resolution Rate</h3>
          <CheckCircle size={20} className="text-green-500" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-800">
              {Math.round((counsellorData.statistics.resolvedIssues / counsellorData.statistics.totalIssues) * 100)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">Total resolved</p>
          </div>
          <div className="text-green-500 text-sm font-medium">+5.2%</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-600 text-sm font-medium">High Priority</h3>
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-800">{counsellorData.statistics.highPriorityIssues}</p>
            <p className="text-sm text-gray-500 mt-1">Needs attention</p>
          </div>
          <div className="text-red-500 text-sm font-medium">+2.4%</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-600 text-sm font-medium">Avg. Resolution Time</h3>
          <Clock size={20} className="text-purple-500" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-800">{counsellorData.statistics.averageResolutionTime}h</p>
            <p className="text-sm text-gray-500 mt-1">Per issue</p>
          </div>
          <div className="text-green-500 text-sm font-medium">-8.3%</div>
        </div>
      </div>
    </div>
  );

  const CategoryDistribution = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Category Distribution</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
      </div>
      <div className="space-y-4">
        {areaStatistics.topIssueCategories.map((category, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{category.category}</span>
              <span className="text-sm text-gray-500">{category.count} issues</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TrendingIssues = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Trending Issues</h3>
        <div className="flex items-center space-x-2">
          <select 
            className="text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {issues.slice(0, 5).map((issue, index) => (
          <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-800">{issue.title}</h4>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  issue.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {issue.priority}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs text-gray-500">{issue.upvotes} upvotes</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedIssue(issue);
                setIssueDetailsModal(true);
              }}
              className="ml-4 text-blue-600 hover:text-blue-700"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const RecentUpdates = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Recent Updates</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
      </div>
      <div className="space-y-6">
        {issues.slice(0, 3).map((issue, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Activity size={16} className="text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-800">{issue.updates[0].comment}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">{issue.updates[0].date}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs font-medium text-blue-600">{issue.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Modals
  const NotificationsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end">
      <div className="w-full max-w-md bg-white h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <button 
            onClick={() => setShowNotifications(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <XIcon size={20} />
          </button>
        </div>
        <div className="p-4">
          {notifications.map((notification, index) => (
            <div 
              key={index}
              className={`p-4 mb-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
            >
              <div className="flex items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  notification.type === 'new_issue' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {notification.type === 'new_issue' ? (
                    <AlertTriangle size={16} className="text-red-600" />
                  ) : (
                    <CheckCircle size={16} className="text-green-600" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const IssueDetailsModal = () => {
    if (!selectedIssue) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{selectedIssue.title}</h3>
                <p className="text-sm text-gray-600 mt-1">Issue ID: {selectedIssue.id}</p>
              </div>
              <button 
                onClick={() => setIssueDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XIcon size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Issue Details</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Category</label>
                    <p className="font-medium text-gray-800">{selectedIssue.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Priority</label>
                    <p className="font-medium text-gray-800">{selectedIssue.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p className="font-medium text-gray-800">{selectedIssue.status}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Location</label>
                    <p className="font-medium text-gray-800">{selectedIssue.location.address}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Timeline</h4>
                <div className="space-y-4">
                  {selectedIssue.updates.map((update, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Activity size={16} className="text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{update.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">{update.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <button 
                  onClick={() => {
                    setSelectedIssue(selectedIssue);
                    setShowMapModal(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  View on Map
                </button>
                <button 
                  onClick={() => setAssignModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MapModal = () => {
    if (!selectedIssue) return null;

    useEffect(() => {
      const map = L.map('issueMap').setView(selectedIssue.location.coordinates, 16);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      L.marker(selectedIssue.location.coordinates)
        .addTo(map)
        .bindPopup(selectedIssue.title)
        .openPopup();

      return () => map.remove();
    }, [selectedIssue]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Issue Location</h3>
            <button 
              onClick={() => setShowMapModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <XIcon size={20} />
            </button>
          </div>
          <div className="p-4">
            <div id="issueMap" className="h-[400px] rounded-lg"></div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-800">{selectedIssue.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{selectedIssue.location.address}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        {!isMobile && (
          <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-sm">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-blue-600">CityFix</h1>
              <p className="text-sm text-gray-500 mt-1">Counsellor Dashboard</p>
            </div>
            
            <nav className="mt-6">
              <div className="px-4 mb-2">
                <span className="text-xs font-medium text-gray-400">MAIN MENU</span>
              </div>
              <button 
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center px-6 py-3 ${
                  activeView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Layout size={20} className="mr-3" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => setActiveView('issues')}
                className={`w-full flex items-center px-6 py-3 ${
                  activeView === 'issues' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText size={20} className="mr-3" />
                <span>Issues</span>
              </button>
              <button 
                onClick={() => setActiveView('analytics')}
                className={`w-full flex items-center px-6 py-3 ${
                  activeView === 'analytics' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart2 size={20} className="mr-3" />
                <span>Analytics</span>
              </button>
              
              <div className="px-4 mt-6 mb-2">
                <span className="text-xs font-medium text-gray-400">MANAGEMENT</span>
              </div>
              <button 
                onClick={() => setActiveView('team')}
                className={`w-full flex items-center px-6 py-3 ${
                  activeView === 'team' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users size={20} className="mr-3" />
                <span>Team</span>
              </button>
              <button 
                onClick={() => setActiveView('tasks')}
                className={`w-full flex items-center px-6 py-3 ${
                  activeView === 'tasks' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TouchpadOff size={20} className="mr-3" />
                <span>Tasks</span>
              </button>
              
              <div className="px-4 mt-6 mb-2">
                <span className="text-xs font-medium text-gray-400">SETTINGS</span>
              </div>
              <button 
                onClick={() => setActiveView('profile')}
                className={`w-full flex items-center px-6 py-3 ${
                  activeView === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User size={20} className="mr-3" />
                <span>Profile</span>
              </button>
              <button 
                onClick={() => setActiveView('settings')}
                className={`w-full flex items-center px-6 py-3 ${
                  activeView === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings size={20} className="mr-3" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 ${!isMobile ? 'ml-64' : ''}`}>
          <div className="p-6">
            <DashboardHeader />
            
            {activeView === 'dashboard' && (
              <>
                <StatisticsCards />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CategoryDistribution />
                  <TrendingIssues />
                </div>
                <RecentUpdates />
              </>
            )}
            
            {/* Add other views here */}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showNotifications && <NotificationsModal />}
      {issueDetailsModal && <IssueDetailsModal />}
      {showMapModal && <MapModal />}
    </div>
  );
};

export default AreaCounsellor;