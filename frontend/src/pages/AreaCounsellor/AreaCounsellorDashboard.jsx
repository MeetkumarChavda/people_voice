import React, { useState, useEffect, useRef } from 'react';
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
  XIcon,
  MapPinIcon,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { IssueCard, IssueDetailsModal, IssueFilters } from './components/IssueManagement';
import apiClient from '../../services/api.config';
import { toast } from 'react-hot-toast';

// New SetCoordinatesModal Component
const SetCoordinatesModal = ({ isOpen, onClose, userLocation, setUserLocation, fetchAreaIssues }) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [radius, setRadius] = useState(1); // Default 1 km radius
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    if (isOpen && !mapRef.current && userLocation) {
      // Initialize map
      const map = L.map('coordinates-map').setView([userLocation.lat, userLocation.lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add marker
      const marker = L.marker([userLocation.lat, userLocation.lng], { draggable: true }).addTo(map);
      
      // Add circle for radius
      const circle = L.circle([userLocation.lat, userLocation.lng], {
        radius: radius * 1000, // Convert km to meters
        fillColor: '#3b82f6',
        fillOpacity: 0.2,
        color: '#3b82f6',
        weight: 1
      }).addTo(map);

      // Update circle when marker is dragged
      marker.on('drag', (e) => {
        const pos = e.target.getLatLng();
        circle.setLatLng(pos);
        setUserLocation({ lat: pos.lat, lng: pos.lng });
      });

      mapRef.current = map;
      markerRef.current = marker;
      circleRef.current = circle;
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        circleRef.current = null;
      }
    };
  }, [isOpen, userLocation]);

  // Handle radius changes
  useEffect(() => {
    if (mapRef.current && markerRef.current && circleRef.current) {
      const pos = markerRef.current.getLatLng();
      
      // Update the circle's radius without removing it
      circleRef.current.setRadius(radius * 1000);

      // Optional: Fit the map bounds to show the entire circle
      const bounds = circleRef.current.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [radius]);

  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        if (mapRef.current && markerRef.current && circleRef.current) {
          const newLatLng = [latitude, longitude];
          mapRef.current.setView(newLatLng, 15);
          markerRef.current.setLatLng(newLatLng);
          circleRef.current.setLatLng(newLatLng);
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        setLocationError('Unable to retrieve your location: ' + error.message);
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleSave = () => {
    if (userLocation) {
      fetchAreaIssues(userLocation, radius);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Set Area Coordinates</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <button
              onClick={getUserLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all"
              disabled={isLoadingLocation}
            >
              <MapPinIcon size={18} />
              {isLoadingLocation ? 'Getting Location...' : 'Get Current Location'}
            </button>
            {locationError && (
              <p className="mt-2 text-red-600 text-sm">{locationError}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coverage Radius (km)
            </label>
            <input
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={radius}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value >= 0.1 && value <= 10) {
                  setRadius(value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Map Container */}
          <div id="coordinates-map" className="h-[400px] rounded-lg mb-6" />

          {userLocation && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Selected Location</h4>
              <p className="text-sm text-gray-600">
                Latitude: {userLocation.lat.toFixed(6)}<br />
                Longitude: {userLocation.lng.toFixed(6)}<br />
                Radius: {radius} km
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Save Coordinates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New issue reported in your area",
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      message: "Issue #123 has been updated",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true
    }
  ]);

  // Add new state variables for location handling
  const [showSetCoordinatesModal, setShowSetCoordinatesModal] = useState(false);
  const [userLocation, setUserLocation] = useState(() => {
    const savedLocation = localStorage.getItem('userLocation');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });
  const [areaIssues, setAreaIssues] = useState([]);
  const [currentArea, setCurrentArea] = useState(null);

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

  // Update useEffect to handle saved location
  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
      fetchAreaIssues(userLocation);
    }
  }, [userLocation]);

  // Function to fetch issues for the current area
  const fetchAreaIssues = async (coordinates, radius = 1) => {
    if (!coordinates) {
      setError('No coordinates provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert radius from kilometers to meters
      const maxDistance = radius * 1000;
      
      console.log('Fetching issues with params:', {
        longitude: coordinates.lng,
        latitude: coordinates.lat,
        maxDistance
      });

      const response = await apiClient.get('/issues/location/nearby', {
        params: {
          longitude: coordinates.lng,
          latitude: coordinates.lat,
          maxDistance
        }
      });
      
      console.log('Raw API Response:', response);

      // Handle different response formats
      let issues = [];
      if (Array.isArray(response)) {
        issues = response;
      } else if (response.data && Array.isArray(response.data)) {
        issues = response.data;
      } else if (response.issues && Array.isArray(response.issues)) {
        issues = response.issues;
      }

      console.log('Processed issues:', issues);
      
      if (issues.length === 0) {
        setError('No issues found in this area');
      }
      
      // Update the state with the latest data from the server
      setAreaIssues(issues);
    } catch (err) {
      console.error('Error fetching area issues:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch issues';
      console.error('Error details:', errorMessage);
      setError(`Failed to fetch issues: ${errorMessage}`);
      // Don't clear the existing issues if the fetch fails
      // This prevents the UI from flickering
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    // Implement filtering logic for areaIssues
    console.log('Filters changed:', filters);
  };

  const handlePhaseUpdate = async (updatedIssue) => {
    try {
      console.log('Received updated issue:', updatedIssue);
      
      if (!updatedIssue || !updatedIssue._id) {
        console.error('Invalid updated issue data received');
        toast.error('Failed to update issue: Invalid data');
        return;
      }
      
      // Update the issues list with the updated issue
      setAreaIssues(prevIssues => 
        prevIssues.map(issue => 
          issue._id === updatedIssue._id ? updatedIssue : issue
        )
      );

      // Show success message
      toast.success('Issue updated successfully');
      
      // Refresh the issues list to get the latest data from the server
      if (userLocation) {
        try {
          await fetchAreaIssues(userLocation);
          console.log('Issues list refreshed from server');
        } catch (refreshError) {
          console.error('Error refreshing issues list:', refreshError);
          // Continue with the local update if refresh fails
        }
      }
    } catch (error) {
      console.error('Error handling phase update:', error);
      toast.error('Failed to update issue list');
    }
  };

  // Add handleLogout function
  const handleLogout = () => {
    // Clear tokens and user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to home page
    navigate("/");
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

  const renderIssuesList = () => {
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    if (!userLocation) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-600">Please set your coordinates to view issues in your area.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {areaIssues.map(issue => (
          <IssueCard
            key={issue._id}
            issue={issue}
            onViewDetails={(updatedIssue) => {
              console.log('Opening issue details with data:', updatedIssue);
              // Always use the updated issue data from the server
              setSelectedIssue(updatedIssue);
              setIssueDetailsModal(true);
            }}
            onUpdate={handlePhaseUpdate}
          />
        ))}
      </div>
    );
  };

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
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">
                <Zap size={20} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PeopleVoice</h1>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Area Counsellor
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSetCoordinatesModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-sm"
              >
                <MapPinIcon size={18} />
                <span>Set Coordinates</span>
              </button>
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
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
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
            <div className="space-y-6">
              <IssueFilters onFilterChange={handleFilterChange} isLoading={isLoading} />
              {renderIssuesList()}
            </div>
          </>
        )}

        {activeTab === 'issues' && (
          <>
            <IssueFilters onFilterChange={handleFilterChange} isLoading={isLoading} />
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

      {/* Add Set Coordinates Modal */}
      <SetCoordinatesModal
        isOpen={showSetCoordinatesModal}
        onClose={() => setShowSetCoordinatesModal(false)}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        fetchAreaIssues={fetchAreaIssues}
      />
    </div>
  );
};

export default AreaCounsellor;