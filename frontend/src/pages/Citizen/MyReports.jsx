import React, { useState } from 'react';
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
  PlusIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyReports = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Dummy data for reports
  const reports = [
    {
      id: 1,
      title: 'Street Light Malfunction',
      category: 'INFRASTRUCTURE',
      status: 'in-progress',
      location: 'Koramangala 5th Block',
      coordinates: [12.9279, 77.6271],
      reportedDate: 'April 15, 2024',
      updatedDate: 'April 18, 2024',
      description: 'Street light has been non-functional for the past week causing safety concerns.',
      upvotes: 23,
      comments: 8
    },
    {
      id: 2,
      title: 'Garbage Collection Issue',
      category: 'SANITATION',
      status: 'verified',
      location: 'HSR Layout Sector 2',
      coordinates: [12.9147, 77.6497],
      reportedDate: 'April 12, 2024',
      updatedDate: 'April 16, 2024',
      description: 'Regular garbage collection has been inconsistent in the area.',
      upvotes: 45,
      comments: 12
    },
    {
      id: 3,
      title: 'Water Supply Disruption',
      category: 'PLUMBING',
      status: 'resolved',
      location: 'Indiranagar 12th Main',
      coordinates: [12.9719, 77.6412],
      reportedDate: 'April 10, 2024',
      updatedDate: 'April 15, 2024',
      description: 'Frequent water supply disruptions affecting the entire street.',
      upvotes: 67,
      comments: 15
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return 'bg-amber-500';
      case 'verified': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'INFRASTRUCTURE': return 'bg-blue-100 text-blue-600';
      case 'SANITATION': return 'bg-green-100 text-green-600';
      case 'PLUMBING': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Map Modal Component
  const MapModal = () => {
    if (!selectedIssue) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Issue Location</h3>
            <button 
              onClick={() => setShowMapModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="bg-gray-100 h-[500px] rounded-lg relative">
              {/* Map placeholder - Replace with actual map component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapIcon size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Map showing location at coordinates:</p>
                  <p className="text-gray-600 font-medium">
                    {selectedIssue.coordinates[0]}, {selectedIssue.coordinates[1]}
                  </p>
                </div>
              </div>
              
              {/* Red zone indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-24 bg-red-500/20 rounded-full animate-pulse"></div>
                <div className="w-12 h-12 bg-red-500/40 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-4 h-4 bg-red-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-800">{selectedIssue.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{selectedIssue.location}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {showMapModal && <MapModal />}
      
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
            onClick={() => navigate('/post-issue')}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
          >
            <PlusIcon size={20} />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center space-x-2">
            <FilterIcon size={20} />
            <span>Filter</span>
          </button>
        </div>

        {/* Status Filters */}
        <div className="bg-white rounded-lg p-2 mb-6 flex space-x-2 shadow-sm">
          {['all', 'in-progress', 'verified', 'resolved', 'pending'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${getCategoryColor(report.category)}`}>
                      {report.category}
                    </span>
                    <h3 className="text-lg font-medium text-gray-800 mt-2">{report.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <MapPinIcon size={16} className="mr-1" />
                      {report.location}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)} text-white`}>
                    {report.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{report.upvotes} upvotes</span>
                    <span>•</span>
                    <span>{report.comments} comments</span>
                    <span>•</span>
                    <span>Reported: {report.reportedDate}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                      <InfoIcon size={16} className="mr-2" />
                      View Details
                    </button>
                    <button className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                      <HistoryIcon size={16} className="mr-2" />
                      Track Progress
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedIssue(report);
                        setShowMapModal(true);
                      }}
                      className="text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                    >
                      <MapIcon size={16} className="mr-2" />
                      View on Map
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
            onClick={() => navigate('/feed')}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <HomeIcon size={24} />
          </button>
          <button 
            onClick={() => navigate('/map')}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <MapIcon size={24} />
          </button>
          <button className="p-2 text-blue-600">
            <UserCircleIcon size={24} />
          </button>
          <button 
            onClick={() => navigate('/notifications')}
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