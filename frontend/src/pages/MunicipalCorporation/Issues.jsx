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
import apiClient from '../../services/api.config';
import { toast } from 'react-hot-toast';

const API_URL = apiClient.defaults.baseURL || 'http://localhost:5000';

const Issues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalIssues: 0
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    category: 'all',
    currentPhase: 'all',
    sortBy: 'priorityScore',
    sortOrder: 'desc'
  });
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [issueUpdate, setIssueUpdate] = useState({
    title: '',
    description: '',
    category: '',
    location: { address: '' },
    photos: []
  });

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

  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        category: filters.category !== 'all' ? filters.category : '',
        currentPhase: filters.currentPhase !== 'all' ? filters.currentPhase : '',
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        search: searchQuery
      };

      const response = await apiClient.get("/issues/priority/advanced", { params });
      console.log("Fetched issues:", response);
      
      // Handle the response data structure
      const issuesData = response.issues || response;
      setIssues(issuesData);
      
      // Update pagination if available in response
      if (response.pagination) {
        setPagination({
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalIssues: response.pagination.totalCount
        });
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError("Failed to fetch issues. Please try again later.");
      toast.error('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/auth/profile");
      console.log("Fetched profile:", response);
      const userData = response.user || response;
      userData.avatar = userData.name.charAt(0);
      setProfile(userData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchProfile();
  }, [filters, searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }));
  };

  // Function to get correct image URL
  const getImageUrl = (photoPath) => {
    if (!photoPath) return '';
    
    // Handle various path formats
    if (photoPath.startsWith('http')) {
      return photoPath;
    }
    
    // Remove any trailing quotes or commas from the path
    const cleanPath = photoPath.replace(/'|,|_blank'$/g, '');
    
    // Ensure there's no double slash when joining URL parts
    return `${API_URL}/${cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath}`;
  };

  const handleUpdateIssue = async (issueId) => {
    try {
      const formData = new FormData();
      formData.append('title', issueUpdate.title);
      formData.append('description', issueUpdate.description);
      formData.append('category', issueUpdate.category);
      formData.append('location', JSON.stringify(issueUpdate.location));
      
      // Append each photo to formData
      if (issueUpdate.photos) {
        issueUpdate.photos.forEach((photo) => {
          formData.append('photos', photo);
        });
      }

      await apiClient.put(`/issues/${issueId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Issue updated successfully');
      setShowIssueModal(false);
      fetchIssues(); // Refresh the issues list
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update issue');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setIssueUpdate(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  useEffect(() => {
    if (selectedIssue) {
      setIssueUpdate({
        title: selectedIssue.title || '',
        description: selectedIssue.description || '',
        category: selectedIssue.category || '',
        location: selectedIssue.location || { address: '' },
        photos: []
      });
    }
  }, [selectedIssue]);

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
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <select
            value={filters.currentPhase}
            onChange={(e) => handleFilterChange('currentPhase', e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select 
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="priorityScore">Priority Score</option>
                <option value="createdAt">Date Created</option>
                <option value="upvotes">Most Upvotes</option>
                <option value="commentCount">Most Comments</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Items per page</label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderIssueCard = (issue) => {
    if (!issue) return null;

    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'high':
        case 'urgent':
        case 'critical': return 'text-red-600 bg-red-50';
        case 'medium': return 'text-amber-600 bg-amber-50';
        case 'low': return 'text-green-600 bg-green-50';
        case 'resolved': return 'text-blue-600 bg-blue-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    const getPhaseIcon = (priority) => {
      switch (priority?.toLowerCase()) {
        case 'high':
        case 'urgent':
        case 'critical':
          return <AlertTriangleIcon className="w-5 h-5 text-red-600" />;
        case 'medium':
          return <ClockIconSolid className="w-5 h-5 text-amber-600" />;
        case 'low':
          return <CheckIcon className="w-5 h-5 text-green-600" />;
        default:
          return <FileTextIcon className="w-5 h-5 text-gray-600" />;
      }
    };

    return (
      <div key={issue._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getPhaseIcon(issue.priority)}
            <div>
              <h3 className="font-medium text-gray-900">{issue.title || 'Untitled Issue'}</h3>
              <p className="text-sm text-gray-500">
                {issue.location?.address || issue.location || 'No location specified'}
              </p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(issue.priority)}`}>
            {issue.priority ? issue.priority.toUpperCase() : 'NO PRIORITY'}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {issue.description || 'No description provided'}
        </p>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center text-gray-500">
            <ThumbsUpIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">{issue.upvotes || 0}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <MessageSquareIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">{issue.comments?.length || 0}</span>
          </div>
          {issue.images && issue.images.length > 0 && (
            <div className="flex items-center text-gray-500">
              <ImageIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">{issue.images.length}</span>
            </div>
          )}
          {issue.priorityScore && (
            <div className="flex items-center text-gray-500">
              <AlertTriangleIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">Score: {issue.priorityScore}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {issue.reportedBy?.name?.charAt(0) || 'A'}
            </div>
            <span>{issue.reportedBy?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>{new Date(issue.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4">
          <button 
            onClick={() => {
              setSelectedIssue(issue);
              setShowIssueModal(true);
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Manage Issue
          </button>
        </div>
      </div>
    );
  };

  const renderPagination = () => (
    <div className="flex justify-between items-center mt-6">
      <div className="text-sm text-gray-500">
        Showing {issues.length} of {pagination.totalIssues} issues
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handleFilterChange('page', filters.page - 1)}
          disabled={filters.page === 1}
          className={`px-3 py-1 rounded ${
            filters.page === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => handleFilterChange('page', filters.page + 1)}
          disabled={filters.page === pagination.totalPages}
          className={`px-3 py-1 rounded ${
            filters.page === pagination.totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-amber-800 font-medium">Issues Overview</h3>
            <p className="text-amber-700 text-sm">
              Total Issues: {pagination.totalIssues} | Current Page: {pagination.currentPage} of {pagination.totalPages}
            </p>
          </div>
        </div>
      </div>

      {renderFilters()}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {profile && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-medium">
              {profile.avatar}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{profile.name}</h3>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading issues...</p>
        </div>
      ) : issues.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {issues.map(issue => renderIssueCard(issue))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-gray-500">No issues found matching your filters</p>
        </div>
      )}

      {showIssueModal && selectedIssue && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative z-50">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">Update Issue</h2>
              <button 
                onClick={() => setShowIssueModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={issueUpdate.title}
                    onChange={(e) => setIssueUpdate(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Issue title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={issueUpdate.description}
                    onChange={(e) => setIssueUpdate(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Issue description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={issueUpdate.category}
                    onChange={(e) => setIssueUpdate(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Select category</option>
                    {categories.filter(c => c.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={issueUpdate.location.address}
                    onChange={(e) => setIssueUpdate(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, address: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Location address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Photos
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                  {issueUpdate.photos.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      {issueUpdate.photos.length} new photo(s) selected
                    </div>
                  )}
                </div>
              </div>

              {selectedIssue.photos && selectedIssue.photos.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Current Photos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedIssue.photos.map((photo, index) => {
                      const photoUrl = getImageUrl(photo);
                      return (
                        <div key={index} className="relative group">
                          <img 
                            crossOrigin="anonymous"
                            src={photoUrl}
                            alt={`Issue photo ${index + 1}`}
                            className="rounded-lg w-full h-48 object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => handleUpdateIssue(selectedIssue._id)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Update Issue
                </button>
                <button
                  onClick={() => setShowIssueModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Issues;