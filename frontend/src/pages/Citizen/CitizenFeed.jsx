import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  InfoIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

const CitizenFeed = () => {
  // State
  const [activePhase, setActivePhase] = useState('inProgress');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
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
  const postIssueMapRef = useRef(null);
  const postIssueMarkerRef = useRef(null);
  const geocodingTimeoutRef = useRef(null);
  
  const navigate = useNavigate();

  // Dummy data
  const currentUser = {
    _id: '123456',
    name: 'Rahul Kumar',
    location: 'Koramangala, Bangalore',
    avatar: 'RK',
    points: 3580
  };

  const currentIssue = {
    _id: '4289',
    category: 'infrastructure',
    title: 'Broken Street Light at 5th Cross Road',
    description: 'The street light at the corner of 5th Cross Road and 10th Main has been non-functional for over a week now. This has created a safety hazard for pedestrians and vehicles during night time. Immediate attention required.',
    reportedBy: {
      userId: '123456',
      username: 'Rahul Kumar'
    },
    location: {
      address: '5th Cross Road',
      area: 'Koramangala 5th Block',
      coordinates: [12.9279, 77.6271]
    },
    coordinates: [12.9279, 77.6271],
    createdAt: '2024-02-25T00:00:00Z',
    updatedAt: '2024-03-04T00:00:00Z',
    status: 'inProgress',
    assignedTo: {
      role: 'Corporation',
      name: 'Bangalore City Corporation (Infrastructure Dept.)'
    },
    upvotes: 136,
    comments: [
      {
        id: '1',
        userId: '789012',
        username: 'Priya Joshi',
        comment: "I've also noticed this issue. It's particularly dangerous because there's a school nearby.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        upvotes: 8
      },
      {
        id: '2',
        userId: '345678',
        username: 'Arun Chandran • Area Counsellor',
        comment: "Thank you for reporting this issue. I've escalated this to the electrical department and they have assigned a team to fix it by March 4th.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        upvotes: 12
      },
      {
        id: '3',
        userId: '901234',
        username: 'Bangalore Municipal Corporation',
        comment: "Work order has been generated. Our team will be on site tomorrow.",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        upvotes: 22
      }
    ]
  };

  const similarIssues = [
    {
      title: 'Street Light Out on 7th Main',
      distance: 2.3,
      status: 'inProgress',
      upvotes: 92,
      timeAgo: '3 days ago'
    },
    {
      title: 'Damaged Footpath near Park',
      distance: 1.8,
      status: 'verified',
      upvotes: 54,
      timeAgo: '1 day ago'
    },
    {
      title: 'Traffic Signal Malfunction',
      distance: 0.8,
      status: 'resolved',
      upvotes: 128,
      timeAgo: '5 days ago'
    }
  ];

  const trendingIssues = [
    {
      id: 1,
      title: 'Broken Street Light at 5th Cross Road',
      updates: 12,
      status: 'inProgress',
      upvotes: 136,
      coordinates: [12.9279, 77.6271],
      location: 'Koramangala 5th Block'
    },
    {
      id: 2,
      title: 'Garbage Collection Issue',
      updates: 8,
      status: 'verified',
      upvotes: 89,
      coordinates: [12.9147, 77.6497],
      location: 'HSR Layout Sector 2'
    },
    {
      id: 3,
      title: 'Water Supply Disruption',
      updates: 15,
      status: 'resolved',
      upvotes: 245,
      coordinates: [12.9719, 77.6412],
      location: 'Indiranagar 12th Main'
    }
  ];

  const dummyUsers = [
    'Sanjay Patel',
    'Anita Sharma',
    'Dev Kumar',
    'Meena Rao',
    'Vikram Singh',
    'Neha Gupta',
    'Raj Malhotra',
    'Deepa Jain',
    'Prakash Nair',
    'Arjun Reddy'
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
      case 'inProgress': return 'bg-amber-500';
      case 'verified': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'highPriority': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'inProgress': return 'In Progress';
      case 'verified': return 'Verified';
      case 'resolved': return 'Resolved';
      case 'highPriority': return 'High Priority';
      case 'verification': return 'Verification';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Handle post upvote
  const handleUpvote = () => {
    if (!upvoted) {
      setUpvoteCount(upvoteCount + 1);
      setUpvoted(true);
    } else {
      setUpvoteCount(upvoteCount - 1);
      setUpvoted(false);
    }
  };

  // Handle comment upvote
  const handleCommentUpvote = (commentId, currentUpvotes) => {
    setCommentUpvoted(prev => {
      const newState = {...prev};
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
      return randomUsers.join(', ') + ' upvoted this';
    } else {
      return randomUsers.join(', ') + ` and ${count - 3} others upvoted this`;
    }
  };

  // Get progress percentage based on status
  const getProgressPercentage = (status) => {
    switch (status) {
      case 'reported': return 20;
      case 'verified': return 40;
      case 'inProgress': return 60;
      case 'resolved': return 80;
      case 'closed': return 100;
      default: return 0;
    }
  };

  const visibleComments = expandedComments ? currentIssue.comments : currentIssue.comments.slice(0, 2);

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
        setLocationError("Unable to retrieve your location: " + error.message);
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Trigger location fetch when post issue modal opens
  useEffect(() => {
    if (showPostIssueModal) {
      getUserLocation();
    } else {
      // Clear any pending geocoding timeouts when modal closes
      if (geocodingTimeoutRef.current) {
        clearTimeout(geocodingTimeoutRef.current);
      }
    }
  }, [showPostIssueModal]);

  // Enhanced MapModal component with OpenStreetMap
  const MapModal = () => {
    if (!selectedIssue || !selectedIssue.coordinates) return null;

    useEffect(() => {
      // Initialize map only after modal is shown
      const map = L.map('map').setView([selectedIssue.coordinates[0], selectedIssue.coordinates[1]], 16);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add marker
      const marker = L.marker([selectedIssue.coordinates[0], selectedIssue.coordinates[1]])
        .addTo(map)
        .bindPopup(selectedIssue.title)
        .openPopup();

      // Cleanup on modal close
      return () => {
        map.remove();
      };
    }, [selectedIssue]);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-gray-800">Issue Location</h3>
              <span className="ml-2 text-sm text-gray-500">
                {typeof selectedIssue.location === 'string' 
                  ? selectedIssue.location 
                  : selectedIssue.location.area || selectedIssue.location.address}
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
            <div id="map" className="h-[400px] rounded-lg overflow-hidden" />
            
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">{selectedIssue.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {typeof selectedIssue.location === 'string' 
                    ? selectedIssue.location 
                    : `${selectedIssue.location.address}, ${selectedIssue.location.area}`}
                </p>
              </div>
              <a 
                href={`https://www.openstreetmap.org/directions?from=&to=${selectedIssue.coordinates[0]}%2C${selectedIssue.coordinates[1]}`}
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

  const PostIssueModal = () => {
    const mapContainerRef = useRef(null);
    const [address, setAddress] = useState("");
    const [mapInitialized, setMapInitialized] = useState(false);
    const [isGeocodingInProgress, setIsGeocodingInProgress] = useState(false);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    
    // Safe geocoding function with rate limiting and error handling
    const safeReverseGeocode = useCallback((lat, lng) => {
      if (!isGeocodingEnabled || isGeocodingInProgress) return;
      
      setIsGeocodingInProgress(true);
      
      // Add a user-agent header to comply with Nominatim usage policy
      const headers = {
        'User-Agent': 'CityFix-App/1.0',
        'Accept-Language': 'en'
      };
      
      // Use a timeout to prevent too many requests
      if (geocodingTimeoutRef.current) {
        clearTimeout(geocodingTimeoutRef.current);
      }
      
      geocodingTimeoutRef.current = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`, { headers })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.display_name) {
              setAddress(data.display_name);
            }
            setIsGeocodingInProgress(false);
          })
          .catch(error => {
            console.error("Error fetching address:", error);
            setAddress(`Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
            if (error.message.includes("ERR_INSUFFICIENT_RESOURCES") || 
                error.message.includes("429")) {
              setIsGeocodingEnabled(false);
            }
            setIsGeocodingInProgress(false);
          });
      }, 1000);
    }, [isGeocodingEnabled, isGeocodingInProgress]);

    // Get user's current location with better error handling
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
        setLocationError(`Unable to retrieve your location: ${error.message}`);
        setIsLoadingLocation(false);
      };

      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      });
    }, [safeReverseGeocode]);

    // Initialize map when modal opens and location is available
    useEffect(() => {
      if (!showPostIssueModal || !mapContainerRef.current || mapInitialized) return;

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
            center: userLocation ? [userLocation.lat, userLocation.lng] : [20.5937, 78.9629], // Default to India's center if no location
            zoom: userLocation ? 16 : 5,
            attributionControl: true
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add marker if we have user location
          if (userLocation) {
            const marker = L.marker([userLocation.lat, userLocation.lng], {
              draggable: true
            }).addTo(map);

            marker.on('dragend', () => {
              const position = marker.getLatLng();
              setUserLocation({ lat: position.lat, lng: position.lng });
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
    }, [showPostIssueModal, userLocation, safeReverseGeocode, getCurrentLocation]);

    // Update map size when container changes
    useEffect(() => {
      if (mapRef.current && mapInitialized) {
        mapRef.current.invalidateSize();
      }
    }, [mapInitialized]);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Report New Issue</h2>
            <p className="text-gray-600 mt-1">Fill in the details below to report a public issue</p>
          </div>

          <div className="px-8 py-6 max-h-[calc(100vh-250px)] overflow-y-auto">
            <div className="space-y-6">
              <input type="hidden" value="public" />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "infrastructure", "publicSafety", "environmental",
                    "governmentServices", "socialWelfare", "publicTransportation",
                    "plumbing", "electricity", "carpentry", "cleaning", "other"
                  ].map((cat) => (
                    <button
                      key={cat}
                      className="flex items-center px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <InfoIcon size={18} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {cat.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a clear title for the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide detailed description of the issue"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <button 
                      onClick={getUserLocation}
                      className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all flex items-center"
                      disabled={isLoadingLocation}
                    >
                      {isLoadingLocation ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading
                        </span>
                      ) : (
                        <span>Current Location</span>
                      )}
                    </button>
                  </div>
                  
                  {locationError && (
                    <div className="text-red-500 text-sm">{locationError}</div>
                  )}
                  
                  {!isGeocodingEnabled && (
                    <div className="text-amber-600 text-xs flex items-center">
                      <InfoIcon size={14} className="mr-1" />
                      Address lookup temporarily unavailable. Using coordinates instead.
                    </div>
                  )}
                  
                  <div className="h-60 bg-gray-100 rounded-lg relative">
                    {!userLocation ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <MapIcon size={24} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          {isLoadingLocation 
                            ? "Getting your location..." 
                            : locationError 
                              ? "Location error" 
                              : "Click 'Current Location' to show map"}
                        </span>
                      </div>
                    ) : (
                      <div ref={mapContainerRef} className="h-full w-full rounded-lg"></div>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Latitude"
                      value={userLocation ? userLocation.lat.toFixed(6) : ""}
                      readOnly
                    />
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Longitude"
                      value={userLocation ? userLocation.lng.toFixed(6) : ""}
                      readOnly
                    />
                    <input
                      type="text"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Photos</label>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((index) => (
                    <div 
                      key={index} 
                      className="aspect-square w-full max-w-[120px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all"></div>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 group-hover:bg-blue-200 transition-all transform group-hover:scale-110">
                        <PlusIcon size={16} className="text-blue-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600">Photo {index}</span>
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
  };

  const renderTrendingIssues = () => (
    <div className="bg-white rounded-lg shadow-sm mb-4 transition-all duration-300 hover:shadow-md">
      <div className="p-3 border-b border-gray-100">
        <h3 className="font-medium text-gray-700">Trending in Your Area</h3>
      </div>
      <div className="p-3">
        {trendingIssues.map((issue, index) => (
          <div 
            key={index} 
            className={`mb-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 ${
              index !== trendingIssues.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="font-medium text-sm text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
              {issue.title}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex text-xs text-gray-500 items-center">
                <span>{issue.updates} updates</span>
                <span className="mx-1">•</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${getStatusColor(issue.status)} text-white`}>
                  {getStatusText(issue.status)}
                </span>
              </div>
              <button 
                onClick={() => {
                  setSelectedIssue(issue);
                  setShowMapModal(true);
                }}
                className="text-xs px-1.5 py-0.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all duration-300 flex items-center gap-0.5 transform hover:scale-105"
              >
                <MapIcon size={10} />
                <span className="text-[10px]">Map</span>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {issue.upvotes} upvotes • {issue.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 py-3 px-4 flex justify-between items-center text-white shadow-md transition-all duration-300">
        <div className="font-bold text-xl">CityFix</div>
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
              className="flex items-center space-x-1 p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <UserCircleIcon size={24} />
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 transition-all duration-200 animate-fadeIn">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                      {currentUser.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{currentUser.name}</div>
                      <div className="text-sm text-gray-500">{currentUser.points} points</div>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button 
                    onClick={() => navigate('/profile')} 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Your Profile
                  </button>
                  <div className="border-t border-gray-200 mt-1 pt-1">
                    <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      {isMobile && (
        <div className="flex justify-around bg-white border-b border-gray-200 shadow-sm">
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'feed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('feed')}
          >
            Issues Feed
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'similar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('similar')}
          >
            Similar Issues
          </button>
          <button 
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'trending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('trending')}
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
                  {currentUser.avatar}
                </div>
                <div className="font-bold text-gray-800">{currentUser.name}</div>
                <div className="text-xs text-gray-500 mt-1">{currentUser.location}</div>
              </div>
              <div className="flex flex-col text-sm">
                <a href="#" className="px-4 py-3 text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                  <HomeIcon size={16} />
                  <span>Home</span>
                </a>
                <a href="#" className="px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 transition-colors">
                  <ChevronLeftIcon size={16} />
                  <span>Issues Feed</span>
                </a>
                <button 
                  onClick={() => navigate('/my-reports')} 
                  className="px-4 py-3 text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <UserCircleIcon size={16} />
                  <span>My Reports</span>
                </button>
                <button 
                  onClick={() => navigate('/notifications')} 
                  className="px-4 py-3 text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <BellIcon size={16} />
                  <span>Notifications</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <a href="#" className="px-4 py-3 text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                  <MapIcon size={16} />
                  <span>Area Map</span>
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <a href="#" className="px-4 py-3 text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                  <CogIcon size={16} />
                  <span>Settings</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Middle content */}
        {(!isMobile || activeTab === 'feed') && (
          <div className="flex-1 transition-all duration-500">
            <div className="bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md mb-4">
              <div className="flex justify-between items-start p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm mr-3 shadow-sm">
                    {currentUser.avatar}
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-gray-800">{currentUser.name}</div>
                    </div>
                    <div className="text-xs text-gray-500">{currentUser.location}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(activePhase)} text-white`}>
                    {getStatusText(activePhase)}
                  </span>
                </div>
              </div>

              <div className="flex justify-center items-center bg-gray-100 h-48 rounded-md mx-4 my-4 border border-gray-200">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div className="text-sm">Issue Image</div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block text-xs font-medium px-2 py-1 rounded-md bg-blue-100 text-blue-600">
                    INFRASTRUCTURE
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedIssue(currentIssue);
                      setShowMapModal(true);
                    }}
                    className="text-xs px-2 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 flex items-center gap-1"
                  >
                    <MapIcon size={12} />
                    View on Map
                  </button>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">{currentIssue.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{currentIssue.description}</p>

                <div className="text-xs text-gray-500 mb-1">
                  Reported: February 25, 2024 • Updated: March 4, 2024 • ID: #{currentIssue._id}
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  Assigned to: {currentIssue.assignedTo.name}
                </div>

                {/* Enhanced Upvote Button */}
                <div className="mb-6">
                  <button 
                    onClick={handleUpvote}
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      upvoted 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                    } transition-all duration-300 group`}
                  >
                    <ArrowUpIcon 
                      size={20} 
                      className={`mr-2 transform transition-transform duration-300 ${
                        upvoted ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'
                      }`} 
                    />
                    <span className={`font-medium ${upvoted ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}`}>
                      {upvoteCount} upvotes
                    </span>
                  </button>
                  
                  {/* Upvoters Display */}
                  <div className="mt-2 text-xs text-gray-500">
                    {getUpvotersText(upvoteCount)}
                  </div>
                </div>

                {/* Progress tracker - Enhanced */}
                <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    {['reported', 'verified', 'inProgress', 'resolved', 'closed'].map((phase, idx) => (
                      <div 
                        key={idx} 
                        className={`flex-1 text-center text-xs font-medium 
                          ${phase === activePhase ? 'text-green-600' : 'text-gray-500'}`}
                      >
                        {phase === 'inProgress' ? 'In Progress' : phase.charAt(0).toUpperCase() + phase.slice(1)}
                      </div>
                    ))}
                  </div>
                  
                  <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
                      style={{ width: `${getProgressPercentage(activePhase)}%` }}
                    ></div>
                    
                    {/* Enhanced Checkpoint markers */}
                    <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-1">
                      {['reported', 'verified', 'inProgress', 'resolved', 'closed'].map((phase, idx) => {
                        const isActive = getProgressPercentage(activePhase) >= getProgressPercentage(phase);
                        return (
                          <div 
                            key={idx} 
                            className={`w-6 h-6 rounded-full z-10 flex items-center justify-center -mt-0 transition-all duration-300 
                              ${isActive ? 'bg-white shadow-lg border-2 border-green-500' : 'bg-gray-200'}`}
                          >
                            {isActive && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Comments section */}
                <h3 className="font-bold text-gray-800 mb-4">Comments ({currentIssue.comments.length})</h3>
                <div className="space-y-4">
                  {visibleComments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${
                          comment.username.startsWith('Bangalore') ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        } text-white flex items-center justify-center font-bold text-sm mr-3 shadow-sm`}>
                          {comment.username.startsWith('Bangalore') ? 'BM' : comment.username.substring(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-800">{comment.username}</div>
                            <div className="text-xs text-gray-500">{getRelativeTime(comment.timestamp)}</div>
                          </div>
                          <div className="text-gray-700 mt-2">{comment.comment}</div>
                          <div className="flex items-center mt-3 space-x-4">
                            {/* Enhanced Comment Upvote Button */}
                            <button 
                              onClick={() => handleCommentUpvote(comment.id, comment.upvotes)}
                              className={`flex items-center px-2 py-1 rounded-lg ${
                                commentUpvoted[comment.id] 
                                  ? 'bg-blue-50 border border-blue-200' 
                                  : 'hover:bg-blue-50 hover:border-blue-200'
                              } transition-all duration-300 group`}
                            >
                              <div className="relative">
                                <ArrowUpIcon 
                                  size={16} 
                                  className={`transform transition-transform duration-300 ${
                                    commentUpvoted[comment.id] ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'
                                  }`}
                                />
                                {commentUpvoted[comment.id] && (
                                  <div className="absolute -top-2 -right-2 text-xs bg-blue-100 text-blue-600 px-1 rounded-full animate-pulse">
                                    +1
                                  </div>
                                )}
                              </div>
                              <span className={`text-sm font-medium ml-1 ${
                                commentUpvoted[comment.id] ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                              }`}>
                                {commentUpvoted[comment.id] ? comment.upvotes + 1 : comment.upvotes}
                              </span>
                            </button>
                            <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                              Reply
                            </button>
                          </div>
                          
                          {/* Comment upvoters */}
                          {commentUpvoted[comment.id] && (
                            <div className="mt-2 text-xs text-blue-500 animate-fadeIn">
                              You and {comment.upvotes} others upvoted this comment
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {currentIssue.comments.length > 2 && (
                    <button 
                      onClick={() => setExpandedComments(!expandedComments)}
                      className="w-full text-center py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {expandedComments ? 'Show Less' : `Show ${currentIssue.comments.length - 2} More Comments`}
                    </button>
                  )}
                </div>

                <div className="flex mt-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm mr-3 shadow-sm">
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1">
                    <input 
                      placeholder="Add a comment..." 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    />
                    <div className="flex justify-end mt-2">
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right sidebar - visible on desktop or when 'similar' tab is active on mobile */}
        {(!isMobile || activeTab === 'similar') && (
          <div className={`${isMobile ? 'w-full' : 'w-64'} transition-all duration-500`}>
            {renderTrendingIssues()}
          </div>
        )}

        {/* Trending section - only visible on mobile when that tab is active */}
        {isMobile && activeTab === 'trending' && (
          <div className="w-full transition-all duration-500">
            <div className="bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="p-3 border-b border-gray-100">
                <h3 className="font-medium text-gray-700">Trending in Your Area</h3>
              </div>
              <div className="p-3">
                {trendingIssues.map((issue, index) => (
                  <div 
                    key={index} 
                    className="mb-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="font-medium text-gray-800">{issue.title}</div>
                    <div className="flex text-xs text-gray-500 mt-2">
                      <span>{issue.updates} updates</span>
                      <span className="mx-1">•</span>
                      <span className={`${getStatusColor(issue.status)} text-white px-1.5 py-0.5 rounded text-xs`}>
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
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">View all trending issues</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-lg">
          <button className="p-2 text-blue-600">
            <HomeIcon size={24} />
          </button>
          <button className="p-2 text-gray-500">
            <MapIcon size={24} />
          </button>
          <button className="p-2 bg-blue-600 text-white rounded-full transform -translate-y-4 shadow-lg">
            <PlusIcon size={24} />
          </button>
          <button className="p-2 text-gray-500">
            <BellIcon size={24} />
          </button>
          <button className="p-2 text-gray-500">
            <UserCircleIcon size={24} />
          </button>
        </div>
      )}

      {showPostIssueModal && <PostIssueModal />}
      {showMapModal && <MapModal />}
    </div>
  );
};

export default CitizenFeed;