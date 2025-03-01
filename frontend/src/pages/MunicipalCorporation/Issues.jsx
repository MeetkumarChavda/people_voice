import React, { useState, useEffect } from 'react';
import {
  AlertTriangleIcon,
  ClockIcon,
  FileTextIcon,
  FilterIcon,
  MapPinIcon,
  SearchIcon,
  ImageIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
  CheckIcon,
  ClockIcon as ClockIconSolid,
  XIcon,
} from 'lucide-react';

const Issues = ({ escalatedIssues = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issuePhaseUpdate, setIssuePhaseUpdate] = useState({
    status: '',
    comments: '',
    proof: []
  });
  const [issues, setIssues] = useState(escalatedIssues);

  const categories = [
    { id: 'all', name: 'All Issues' },
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'publicSafety', name: 'Public Safety' },
    { id: 'environmental', name: 'Environmental' },
    { id: 'governmentServices', name: 'Government Services' },
    { id: 'socialWelfare', name: 'Social Welfare' },
    { id: 'publicTransportation', name: 'Public Transportation' }
  ];

  const phases = [
    { id: 'all', name: 'All Phases' },
    { id: 'verification', name: 'Verification' },
    { id: 'inProgress', name: 'In Progress' },
    { id: 'resolved', name: 'Resolved' },
    { id: 'highPriority', name: 'High Priority' }
  ];

  const handlePhaseUpdate = async (issueId, phase, updateData) => {
    try {
      // API call would go here
      setShowIssueModal(false);
    } catch (error) {
      console.error('Phase update error:', error);
    }
  };

  useEffect(() => {
    setIssues(escalatedIssues);
  }, [escalatedIssues]);

  // Filter issues based on search query and filters
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchesPhase = selectedPhase === 'all' || issue.phase === selectedPhase;

    return matchesSearch && matchesCategory && matchesPhase;
  });

  const renderFilters = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="flex-1 mb-4 md:mb-0">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search issues..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {phases.map(phase => (
              <option key={phase.id} value={phase.id}>{phase.name}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FilterIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">Priority</option>
                <option value="upvotes">Most Upvotes</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderIssueCard = (issue) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'high': return 'text-red-600 bg-red-50';
        case 'medium': return 'text-amber-600 bg-amber-50';
        case 'low': return 'text-green-600 bg-green-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    const getPhaseIcon = (phase) => {
      switch (phase) {
        case 'verification':
          return <AlertTriangleIcon className="w-5 h-5 text-blue-600" />;
        case 'inProgress':
          return <ClockIconSolid className="w-5 h-5 text-amber-600" />;
        case 'resolved':
          return <CheckIcon className="w-5 h-5 text-green-600" />;
        case 'highPriority':
          return <AlertTriangleIcon className="w-5 h-5 text-red-600" />;
        default:
          return <FileTextIcon className="w-5 h-5 text-gray-600" />;
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getPhaseIcon(issue.phase)}
            <div>
              <h3 className="font-medium text-gray-900">{issue.title}</h3>
              <p className="text-sm text-gray-500">{issue.location}</p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getPriorityColor(issue.priority)}`}>
            {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">{issue.description}</p>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-1" />
            {issue.location}
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            {issue.reportedAt}
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center text-gray-500">
            <ThumbsUpIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">{issue.upvotes}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <MessageSquareIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">{issue.comments}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <ImageIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">{issue.images}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Escalated From</p>
              <p className="text-sm text-gray-500">{issue.areaCounsellor.name}</p>
            </div>
            <button 
              onClick={() => {
                setSelectedIssue(issue);
                setShowIssueModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Manage Issue
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderIssueModal = () => {
    if (!selectedIssue) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm"></div>
        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative z-50 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">{selectedIssue.title}</h2>
            <button 
              onClick={() => setShowIssueModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Issue Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedIssue.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reported On</p>
                  <p className="font-medium">{selectedIssue.reportedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <p className="font-medium capitalize">{selectedIssue.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{selectedIssue.phase}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {selectedIssue.timeline && (
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Issue Timeline</h3>
                <div className="space-y-4">
                  {selectedIssue.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{event.action}</p>
                          <span className="text-xs text-gray-500">by {event.by}</span>
                        </div>
                        <p className="text-sm text-gray-600">{event.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Metrics */}
            {selectedIssue.impactMetrics && (
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Impact Assessment</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Households Affected</p>
                    <p className="font-medium text-amber-900">{selectedIssue.impactMetrics.householdsAffected}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Repair Time</p>
                    <p className="font-medium text-amber-900">{selectedIssue.impactMetrics.estimatedRepairTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Cost</p>
                    <p className="font-medium text-amber-900">{selectedIssue.impactMetrics.estimatedCost}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{selectedIssue.description}</p>
            </div>

            {/* Affected Areas */}
            {selectedIssue.affectedAreas && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Affected Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIssue.affectedAreas.map((area, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Update Status */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Update Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Status
                  </label>
                  <select
                    value={issuePhaseUpdate.status}
                    onChange={(e) => setIssuePhaseUpdate(prev => ({
                      ...prev,
                      status: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Select status</option>
                    <option value="inProgress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="escalated">Escalated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comments
                  </label>
                  <textarea
                    value={issuePhaseUpdate.comments}
                    onChange={(e) => setIssuePhaseUpdate(prev => ({
                      ...prev,
                      comments: e.target.value
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Add update comments..."
                  />
                </div>

                <button
                  onClick={() => handlePhaseUpdate(selectedIssue.id, issuePhaseUpdate)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Update Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-amber-800 font-medium">Escalated Issues</h3>
            <p className="text-amber-700 text-sm">
              These issues have exceeded their deadline and require immediate attention from the Municipal Corporation.
            </p>
          </div>
        </div>
      </div>
      {renderFilters()}
      {filteredIssues.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredIssues.map(issue => renderIssueCard(issue))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-gray-500">No escalated issues match your filters</p>
        </div>
      )}
      {showIssueModal && renderIssueModal()}
    </>
  );
};

export default Issues; 