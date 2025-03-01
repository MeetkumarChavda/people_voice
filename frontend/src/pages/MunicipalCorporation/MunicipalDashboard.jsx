import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  AlertTriangleIcon,
  BarChart3Icon,
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  FilterIcon,
  MapPinIcon,
  SearchIcon,
  UserCheckIcon,
  AlertOctagonIcon,
  BuildingIcon,
  UsersIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  XCircleIcon,
  CheckIcon,
  ClockIcon as ClockIconSolid,
  ImageIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
  BellIcon,
  PhoneIcon,
  StarIcon
} from 'lucide-react';
import apiClient from '../../services/api.config';
import { toast } from 'react-hot-toast';
import Issues from './Issues';
import Profile from './Profile';
import CounsellorProfile from './CounsellorProfile';

const MunicipalDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
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
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [showCounsellorProfile, setShowCounsellorProfile] = useState(false);
  const [escalatedIssues, setEscalatedIssues] = useState([]);
  
  // Replace state with static data for demo
  const issueStats = {
    total: 248,
    pending: 45,
    inProgress: 89,
    resolved: 98,
    highPriority: 16
  };

  const areaStats = {
    totalAreas: 12,
    activeAreas: 10,
    totalCounsellors: 15,
    verifiedCounsellors: 12
  };

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

  const staticIssues = [
    {
      id: 'ISS001',
      title: 'Broken Street Light on 5th Avenue',
      category: 'infrastructure',
      description: 'Multiple street lights not functioning for past week causing safety concerns.',
      location: 'Sector 5, Block B',
      reportedBy: 'Rahul Kumar',
      reportedAt: '2024-03-01',
      phase: 'verification',
      deadline: '2024-03-15',
      priority: 'high',
      upvotes: 45,
      comments: 12,
      images: 3,
      areaCounsellor: {
        name: 'Amit Patel',
        response: 'Inspection scheduled for tomorrow'
      },
      status: 'pending',
      updates: [
        {
          date: '2024-03-02',
          author: 'Amit Patel',
          content: 'Site inspection completed. Parts ordered.',
          phase: 'verification'
        }
      ]
    },
    {
      id: 'ISS002',
      title: 'Garbage Collection Irregular',
      category: 'environmental',
      description: 'No garbage collection for past 3 days in entire sector.',
      location: 'Sector 7',
      reportedBy: 'Priya Singh',
      reportedAt: '2024-03-02',
      phase: 'inProgress',
      deadline: '2024-03-10',
      priority: 'medium',
      upvotes: 78,
      comments: 23,
      images: 5,
      areaCounsellor: {
        name: 'Suresh Kumar',
        response: 'Coordinating with waste management team'
      },
      status: 'inProgress',
      updates: [
        {
          date: '2024-03-03',
          author: 'Suresh Kumar',
          content: 'Additional trucks deployed',
          phase: 'inProgress'
        }
      ]
    },
    {
      id: 'ISS003',
      title: 'Water Supply Disruption',
      category: 'governmentServices',
      description: 'Low water pressure and irregular supply timing.',
      location: 'Sector 12',
      reportedBy: 'Meera Reddy',
      reportedAt: '2024-02-28',
      phase: 'highPriority',
      deadline: '2024-03-05',
      priority: 'high',
      upvotes: 156,
      comments: 45,
      images: 2,
      areaCounsellor: {
        name: 'Rajesh Verma',
        response: 'Escalated to Municipal Corporation'
      },
      status: 'escalated',
      updates: [
        {
          date: '2024-03-01',
          author: 'Rajesh Verma',
          content: 'Issue requires major pipeline repair',
          phase: 'highPriority'
        }
      ]
    }
  ];

  // Add mock data for area counsellors
  const mockAreaCounsellors = [
    {
      id: 'AC001',
      name: 'Amit Patel',
      area: 'Sector 5',
      email: 'amit.patel@cityfix.com',
      phone: '+91 98765 43210',
      status: 'active',
      verifiedAt: '2024-01-15',
      issuesHandled: 45,
      resolvedIssues: 38,
      rating: 4.8,
      avatar: 'AP',
      activeIssues: 7
    },
    {
      id: 'AC002',
      name: 'Priya Sharma',
      area: 'Sector 7',
      email: 'priya.sharma@cityfix.com',
      phone: '+91 98765 43211',
      status: 'active',
      verifiedAt: '2024-01-20',
      issuesHandled: 32,
      resolvedIssues: 28,
      rating: 4.6,
      avatar: 'PS',
      activeIssues: 4
    },
    {
      id: 'AC003',
      name: 'Rajesh Kumar',
      area: 'Sector 12',
      email: 'rajesh.kumar@cityfix.com',
      phone: '+91 98765 43212',
      status: 'inactive',
      verifiedAt: '2024-02-01',
      issuesHandled: 15,
      resolvedIssues: 12,
      rating: 4.2,
      avatar: 'RK',
      activeIssues: 3
    },
    {
      id: 'AC004',
      name: 'Meera Reddy',
      area: 'Sector 3',
      email: 'meera.reddy@cityfix.com',
      phone: '+91 98765 43213',
      status: 'active',
      verifiedAt: '2024-02-10',
      issuesHandled: 28,
      resolvedIssues: 25,
      rating: 4.9,
      avatar: 'MR',
      activeIssues: 3
    }
  ];

  useEffect(() => {
    // Initialize with some dummy escalated issues
    const dummyEscalatedIssues = [
      {
        id: 'ISS001',
        title: 'Sewage Overflow in Residential Area',
        category: 'infrastructure',
        description: 'Severe sewage overflow affecting multiple streets. Health hazard reported by residents.',
        location: 'Sector 12, Block B',
        reportedBy: 'Amit Shah',
        reportedAt: '2024-03-08',
        originalDeadline: '2024-03-10',
        escalatedAt: '2024-03-11',
        phase: 'highPriority',
        priority: 'high',
        upvotes: 156,
        comments: 32,
        images: 6,
        areaCounsellor: {
          name: 'Priya Sharma',
          response: 'Requires specialized equipment and team'
        },
        status: 'escalated',
        timeline: [
          {
            date: '2024-03-08',
            action: 'Issue Reported',
            by: 'Citizen',
            details: 'Multiple complaints received'
          },
          {
            date: '2024-03-09',
            action: 'Initial Assessment',
            by: 'Area Counsellor',
            details: 'Situation critical, requires immediate action'
          },
          {
            date: '2024-03-11',
            action: 'Escalated',
            by: 'System',
            details: 'Deadline missed, health hazard reported'
          }
        ],
        affectedAreas: ['Sector 12'],
        impactMetrics: {
          householdsAffected: 200,
          estimatedRepairTime: '48 hours',
          estimatedCost: '₹5,00,000'
        }
      },
      {
        id: 'ISS002',
        title: 'Street Light Outage - Safety Concern',
        category: 'publicSafety',
        description: 'Complete darkness in main market area. Multiple safety incidents reported.',
        location: 'Main Market, Sector 4',
        reportedBy: 'Ravi Kumar',
        reportedAt: '2024-03-07',
        originalDeadline: '2024-03-09',
        escalatedAt: '2024-03-10',
        phase: 'highPriority',
        priority: 'high',
        upvotes: 89,
        comments: 15,
        images: 4,
        areaCounsellor: {
          name: 'Suresh Patel',
          response: 'Electrical department coordination required'
        },
        status: 'escalated',
        timeline: [
          {
            date: '2024-03-07',
            action: 'Issue Reported',
            by: 'Citizen',
            details: 'Safety concerns raised by market association'
          },
          {
            date: '2024-03-08',
            action: 'Site Visit',
            by: 'Area Counsellor',
            details: 'Major electrical fault identified'
          },
          {
            date: '2024-03-10',
            action: 'Escalated',
            by: 'System',
            details: 'Resolution deadline missed'
          }
        ],
        affectedAreas: ['Sector 4 Market Area'],
        impactMetrics: {
          businessesAffected: 50,
          estimatedRepairTime: '24 hours',
          estimatedCost: '₹2,00,000'
        }
      }
    ];

    setEscalatedIssues(dummyEscalatedIssues);
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setCurrentUser(decoded);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };
    getUserInfo();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/auth/verification-requests');
      
      if (response && response.success && Array.isArray(response.data)) {
        setRequests(response.data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      toast.error(error.message || 'Failed to fetch requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const canVerify = (counsellor) => {
    if (!currentUser || !counsellor) return false;
    
    if (counsellor.subcategory && counsellor.subcategory.municipalCorporationID) {
      const counsellorMunicipalCorpId = String(counsellor.subcategory.municipalCorporationID);
      const currentUserId = String(currentUser.id);
      
      return counsellorMunicipalCorpId === currentUserId;
    }
    
    return false;
  };

  const handleVerify = async (userId) => {
    try {
      const counsellor = requests.find(req => req._id === userId);
      
      if (!canVerify(counsellor)) {
        toast.error("You don't have permission to verify this user");
        return;
      }
      
      const payload = { userId, approved: true };
      const response = await apiClient.post('/auth/verification-requests', payload);
      
      if (response && response.success) {
        toast.success('Area Counsellor verified successfully!');
        fetchRequests();
      } else {
        toast.error('Verification failed: ' + (response?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.response?.message || error.message || 'Verification failed');
    }
  };

  const handleReject = async (userId) => {
    try {
      const counsellor = requests.find(req => req._id === userId);
      
      if (!canVerify(counsellor)) {
        toast.error("You don't have permission to reject this user");
        return;
      }
      
      const payload = { userId, approved: false };
      const response = await apiClient.post('/auth/verification-requests', payload);
      
      if (response && response.success) {
        toast.success('Area Counsellor rejected successfully!');
        fetchRequests();
      } else {
        toast.error('Rejection failed: ' + (response?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Rejection error:', error);
      toast.error(error.response?.message || error.message || 'Rejection failed');
    }
  };

  const handlePhaseUpdate = async (issueId, phase, updateData) => {
    try {
      // In real implementation, this would be an API call
      // const response = await apiClient.post(`/issues/${issueId}/phase-update`, {
      //   phase,
      //   ...updateData
      // });
      
      toast.success(`Issue phase ${phase} updated successfully`);
      setShowIssueModal(false);
      // Refresh issues list
    } catch (error) {
      console.error('Phase update error:', error);
      toast.error(error.message || 'Failed to update phase');
    }
  };

  const renderIssueDetailsModal = () => {
    if (!selectedIssue) return null;

    const getPhaseStatus = (phase) => {
      const details = selectedIssue.phaseDetails;
      switch (phase) {
        case 'verification':
          return details.verification.status;
        case 'etaDeadline':
          return details.etaDeadline.isExtended ? 'extended' : 'set';
        case 'resolution':
          return details.resolution.status;
        default:
          return 'pending';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">{selectedIssue.title}</h2>
            <button 
              onClick={() => setShowIssueModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon className="w-6 h-6" />
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
                  <p className="text-sm text-gray-500">Original Deadline</p>
                  <p className="font-medium">{selectedIssue.originalDeadline}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Escalated On</p>
                  <p className="font-medium">{selectedIssue.escalatedAt}</p>
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
                    <h4 className="font-medium text-gray-900">Verification Phase</h4>
                    <p className="text-sm text-gray-500">
                      Status: {getPhaseStatus('verification')}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 text-sm font-medium rounded-full bg-green-50 text-green-600">
                    Completed
                  </span>
                </div>
                {selectedIssue.phaseDetails.verification.comments && (
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedIssue.phaseDetails.verification.comments}
                  </p>
                )}
              </div>

              {/* ETA/Deadline Phase */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">ETA/Deadline Phase</h4>
                    <p className="text-sm text-gray-500">
                      Initial Deadline: {selectedIssue.phaseDetails.etaDeadline.initialDeadline}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 text-sm font-medium rounded-full bg-red-50 text-red-600">
                    Exceeded
                  </span>
                </div>
              </div>

              {/* Resolution Phase */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Resolution Phase</h4>
                    <p className="text-sm text-gray-500">
                      Status: {getPhaseStatus('resolution')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Update Status
                    </label>
                    <select
                      value={issuePhaseUpdate.status}
                      onChange={(e) => setIssuePhaseUpdate(prev => ({
                        ...prev,
                        status: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select status</option>
                      <option value="inProgress">In Progress</option>
                      <option value="resolved">Resolved</option>
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
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add resolution comments..."
                    />
                  </div>

                  <button
                    onClick={() => handlePhaseUpdate(selectedIssue.id, 'resolution', issuePhaseUpdate)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Resolution Phase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FileTextIcon className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
            Total Issues
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{issueStats.total}</h3>
        <p className="text-sm text-gray-500">Across all categories</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <ClockIcon className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
            In Progress
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{issueStats.inProgress}</h3>
        <p className="text-sm text-gray-500">Being addressed</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangleIcon className="w-6 h-6 text-red-600" />
          </div>
          <span className="text-sm font-medium text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
            High Priority
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{issueStats.highPriority}</h3>
        <p className="text-sm text-gray-500">Need immediate attention</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
            Resolved
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{issueStats.resolved}</h3>
        <p className="text-sm text-gray-500">Successfully completed</p>
      </div>
    </div>
  );

  const renderAreaStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-3">
          <BuildingIcon className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-700 font-medium">Total Areas</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900">{areaStats.totalAreas}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-3">
          <MapPinIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-700 font-medium">Active Areas</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900">{areaStats.activeAreas}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-3">
          <UsersIcon className="w-5 h-5 text-green-600" />
          <h3 className="text-gray-700 font-medium">Total Counsellors</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900">{areaStats.totalCounsellors}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-3">
          <UserCheckIcon className="w-5 h-5 text-teal-600" />
          <h3 className="text-gray-700 font-medium">Verified Counsellors</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900">{areaStats.verifiedCounsellors}</p>
      </div>
    </div>
  );

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
          return <AlertOctagonIcon className="w-5 h-5 text-blue-600" />;
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

  const renderIssuesList = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {escalatedIssues.map(issue => renderIssueCard(issue))}
    </div>
  );

  const renderRequests = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Area Counsellor Verification Requests</h2>
      
      {loading ? (
        <p className="text-gray-500">Loading verification requests...</p>
      ) : requests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">No pending verification requests</p>
          <button 
            onClick={fetchRequests}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div>
          <div className="space-y-4">
            {requests.map(req => {
              const canVerifyThis = canVerify(req);
              return (
                <div key={req._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {req.name ? req.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <h3 className="font-medium">{req.name} ({req.username})</h3>
                          <p className="text-sm text-gray-600">{req.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>ID: {req._id}</p>
                        {req.subcategory && req.subcategory.municipalCorporationID && (
                          <p>
                            Municipal Corp ID: {req.subcategory.municipalCorporationID}
                            {canVerifyThis ? 
                              <span className="ml-1 text-green-500 font-medium">(Match)</span> : 
                              <span className="ml-1 text-red-500 font-medium">(No Match)</span>}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-x-2">
                      <button 
                        onClick={() => handleVerify(req._id)} 
                        className={`${canVerifyThis ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'} text-white px-4 py-2 rounded-md transition`}
                        disabled={!canVerifyThis}
                        title={!canVerifyThis ? "You don't have permission to verify this user" : ""}
                      >
                        Verify
                      </button>
                      <button 
                        onClick={() => handleReject(req._id)} 
                        className={`${canVerifyThis ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'} text-white px-4 py-2 rounded-md transition`}
                        disabled={!canVerifyThis}
                        title={!canVerifyThis ? "You don't have permission to reject this user" : ""}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button 
            onClick={fetchRequests}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Refresh List
          </button>
        </div>
      )}
    </div>
  );

  const renderAreaCounsellors = () => (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Area Counsellors</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search counsellors..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Areas</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAreaCounsellors.map(counsellor => (
          <div key={counsellor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                  {counsellor.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{counsellor.name}</h3>
                  <p className="text-sm text-gray-500">{counsellor.area}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                counsellor.status === 'active' 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-gray-50 text-gray-600'
              }`}>
                {counsellor.status.charAt(0).toUpperCase() + counsellor.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Issues Handled</p>
                <p className="text-lg font-semibold text-gray-900">{counsellor.issuesHandled}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Resolution Rate</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round((counsellor.resolvedIssues / counsellor.issuesHandled) * 100)}%
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MessageSquareIcon className="w-4 h-4 mr-2" />
                {counsellor.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <PhoneIcon className="w-4 h-4 mr-2" />
                {counsellor.phone}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center">
                <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="text-sm font-medium text-gray-900">{counsellor.rating}</span>
              </div>
              <button 
                onClick={() => {
                  setSelectedCounsellor(counsellor);
                  setShowCounsellorProfile(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Municipal Dashboard | CityFix</title>
      </Helmet>
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CityFix</h1>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Municipal Dashboard
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <BarChart3Icon className="w-6 h-6" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <BellIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {currentUser?.name?.[0] || 'A'}
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm border border-gray-200 w-fit">
          {['overview', 'issues', 'counsellors', 'profile'].map((tab) => (
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
            {renderOverviewStats()}
            {renderAreaStats()}
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent High Priority Issues</h2>
            {escalatedIssues.length > 0 ? (
              <Issues escalatedIssues={escalatedIssues} />
            ) : (
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-gray-500">No escalated issues at the moment</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'issues' && (
          escalatedIssues.length > 0 ? (
            <Issues escalatedIssues={escalatedIssues} />
          ) : (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-gray-500">No escalated issues at the moment</p>
            </div>
          )
        )}

        {activeTab === 'counsellors' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Area Counsellor Management</h2>
            {renderRequests()}
            {renderAreaCounsellors()}
          </div>
        )}

        {activeTab === 'profile' && (
          <Profile currentUser={currentUser} />
        )}
      </div>

      {/* Issue Details Modal */}
      {showIssueModal && renderIssueDetailsModal()}

      {showCounsellorProfile && selectedCounsellor && (
        <CounsellorProfile 
          counsellor={selectedCounsellor}
          onClose={() => setShowCounsellorProfile(false)}
        />
      )}
    </div>
  );
};

export default MunicipalDashboard;