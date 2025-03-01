import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  ThumbsUp,
  XCircle,
  Activity,
  Calendar,
  AlertOctagon,
  CheckIcon,
  ClockIcon,
  Upload
} from 'lucide-react';

export const IssueDetailsModal = ({ issue, onClose, onPhaseUpdate }) => {
  const [phaseUpdate, setPhaseUpdate] = useState({
    status: '',
    comments: '',
    proof: [],
    extendDeadline: false,
    newDeadline: '',
    reason: ''
  });

  const getPhaseStatus = (phase) => {
    if (!issue.phaseDetails) return 'pending';
    
    switch (phase) {
      case 'verification':
        return issue.phaseDetails.verification?.status || 'pending';
      case 'etaDeadline':
        return issue.phaseDetails.etaDeadline?.initialDeadline ? 'set' : 'pending';
      case 'resolution':
        return issue.phaseDetails.resolution?.status || 'pending';
      default:
        return 'pending';
    }
  };

  const handlePhaseUpdate = () => {
    onPhaseUpdate(issue._id, issue.currentPhase, phaseUpdate);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhaseUpdate(prev => ({
      ...prev,
      proof: [...prev.proof, ...files]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{issue.title}</h2>
            <p className="text-sm text-gray-600 mt-1">Issue ID: {issue._id}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Issue Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{issue.location.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reported By</p>
                <p className="font-medium">{issue.reportedBy.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium capitalize">{issue.issueType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium capitalize">{issue.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{issue.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">{new Date(issue.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Phase Management */}
          <div className="border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Phase Management</h3>
            </div>

            {/* Verification Phase */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">Phase 1: Verification</h4>
                  <p className="text-sm text-gray-500">
                    Status: {getPhaseStatus('verification')}
                  </p>
                </div>
                {issue.currentPhase === 'verification' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPhaseUpdate(prev => ({
                        ...prev,
                        status: 'verified'
                      }))}
                      className="px-3 py-1 text-sm font-medium rounded-full bg-green-50 text-green-600 hover:bg-green-100"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => setPhaseUpdate(prev => ({
                        ...prev,
                        status: 'rejected'
                      }))}
                      className="px-3 py-1 text-sm font-medium rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
              {issue.currentPhase === 'verification' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Comments
                  </label>
                  <textarea
                    value={phaseUpdate.comments}
                    onChange={(e) => setPhaseUpdate(prev => ({
                      ...prev,
                      comments: e.target.value
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Add verification comments..."
                  />
                </div>
              )}
            </div>

            {/* ETA/Deadline Phase */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">Phase 2: ETA/Deadline</h4>
                  <p className="text-sm text-gray-500">
                    Current Deadline: {issue.phaseDetails?.etaDeadline?.initialDeadline 
                      ? new Date(issue.phaseDetails.etaDeadline.initialDeadline).toLocaleDateString()
                      : 'Not set'}
                  </p>
                  {issue.phaseDetails?.etaDeadline?.isExtended && (
                    <p className="text-sm text-amber-500">
                      Extended to: {new Date(issue.phaseDetails.etaDeadline.extendedDeadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              {issue.currentPhase === 'etaDeadline' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Set Deadline
                    </label>
                    <input
                      type="date"
                      value={phaseUpdate.newDeadline}
                      onChange={(e) => setPhaseUpdate(prev => ({
                        ...prev,
                        newDeadline: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {!issue.phaseDetails?.etaDeadline?.isExtended && (
                    <div>
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id="extendDeadline"
                          checked={phaseUpdate.extendDeadline}
                          onChange={(e) => setPhaseUpdate(prev => ({
                            ...prev,
                            extendDeadline: e.target.checked
                          }))}
                          className="mr-2"
                        />
                        <label htmlFor="extendDeadline" className="text-sm text-gray-700">
                          Extend Deadline (One-time only)
                        </label>
                      </div>
                      {phaseUpdate.extendDeadline && (
                        <textarea
                          value={phaseUpdate.reason}
                          onChange={(e) => setPhaseUpdate(prev => ({
                            ...prev,
                            reason: e.target.value
                          }))}
                          placeholder="Reason for extension..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Resolution Phase */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">Phase 3: Resolution</h4>
                  <p className="text-sm text-gray-500">
                    Status: {getPhaseStatus('resolution')}
                  </p>
                </div>
              </div>

              {issue.currentPhase === 'resolution' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resolution Status
                    </label>
                    <select
                      value={phaseUpdate.status}
                      onChange={(e) => setPhaseUpdate(prev => ({
                        ...prev,
                        status: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select status</option>
                      <option value="solved">Solved</option>
                      <option value="escalated">Escalate to Municipal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resolution Comments
                    </label>
                    <textarea
                      value={phaseUpdate.comments}
                      onChange={(e) => setPhaseUpdate(prev => ({
                        ...prev,
                        comments: e.target.value
                      }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Add resolution comments..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proof of Resolution
                    </label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                            <span>Upload files</span>
                            <input
                              type="file"
                              multiple
                              onChange={handleFileChange}
                              className="sr-only"
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePhaseUpdate}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Resolution
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Issue Images */}
          {issue.photos && issue.photos.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Issue Photos</h3>
              <div className="grid grid-cols-3 gap-4">
                {issue.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Issue photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          {issue.comments && issue.comments.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Comments</h3>
              <div className="space-y-4">
                {issue.comments.map((comment, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {comment.username[0]}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{comment.username}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const IssueCard = ({ issue, onViewDetails }) => {
  const getStatusColor = (status) => {
    if (!status) return 'text-gray-600 bg-gray-50';
    
    switch (status.toLowerCase()) {
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'verified': return 'text-blue-600 bg-blue-50';
      case 'inProgress': return 'text-purple-600 bg-purple-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'highPriority': return 'text-red-600 bg-red-50';
      case 'redZone': return 'text-red-700 bg-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPhaseIcon = (phase) => {
    if (!phase) return <FileText className="w-5 h-5 text-gray-600" />;

    switch (phase.toLowerCase()) {
      case 'verification':
        return <AlertOctagon className="w-5 h-5 text-blue-600" />;
      case 'etaDeadline':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'resolution':
        return <CheckIcon className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!issue) {
    return null;
  }

  const {
    title = 'Untitled Issue',
    location = { address: 'No location specified' },
    status = 'pending',
    currentPhase = 'verification',
    description = 'No description provided',
    createdAt = new Date(),
    upvotes = 0,
    comments = [],
    photos = []
  } = issue;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getPhaseIcon(currentPhase)}
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{location.address}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(status)}`}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4">{description}</p>

      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {location.address}
        </div>
        <div className="flex items-center">
          <ClockIcon className="w-4 h-4 mr-1" />
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center text-gray-500">
          <ThumbsUp className="w-4 h-4 mr-1" />
          <span className="text-sm">{upvotes}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <MessageSquare className="w-4 h-4 mr-1" />
          <span className="text-sm">{comments.length}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <ImageIcon className="w-4 h-4 mr-1" />
          <span className="text-sm">{photos.length}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Current Phase</p>
            <p className="text-sm text-gray-500 capitalize">{currentPhase}</p>
          </div>
          <button 
            onClick={() => onViewDetails(issue)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Manage Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export const IssueFilters = ({ onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    phase: 'all',
    status: 'all',
    type: 'all',
    dateRange: 'all',
    sortBy: 'newest'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="flex-1 mb-4 md:mb-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search issues..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="publicSafety">Public Safety</option>
            <option value="environmental">Environmental</option>
            <option value="governmentServices">Government Services</option>
            <option value="socialWelfare">Social Welfare</option>
            <option value="publicTransportation">Public Transportation</option>
          </select>
          
          <select
            value={filters.phase}
            onChange={(e) => handleFilterChange('phase', e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Phases</option>
            <option value="verification">Verification</option>
            <option value="etaDeadline">ETA/Deadline</option>
            <option value="resolution">Resolution</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="inProgress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
            <option value="highPriority">High Priority</option>
            <option value="redZone">Red Zone</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="public">Public</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="upvotes">Most Upvotes</option>
                <option value="comments">Most Comments</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
      >
        {showFilters ? 'Less Filters' : 'More Filters'}
      </button>
    </div>
  );
}; 