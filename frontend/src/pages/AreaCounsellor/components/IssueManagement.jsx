import React, { useState, useEffect } from 'react';
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
  Upload,
  Loader
} from 'lucide-react';
import apiClient from '../../../services/api.config';
import { toast } from 'react-hot-toast';

export const IssueDetailsModal = ({ issue, onClose, onPhaseUpdate }) => {
  // Helper function to format dates for display
  const formatDateForDisplay = (isoString) => {
    if (!isoString) return 'Not set';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleString();
    } catch (error) {
      console.error('Error formatting date for display:', error);
      return 'Invalid date';
    }
  };

  // Helper function to format ISO date string to datetime-local input format
  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 16); // Format for datetime-local input (YYYY-MM-DDThh:mm)
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const [phaseUpdate, setPhaseUpdate] = useState({
    verification: {
      status: issue.phaseDetails?.verification?.status || 'pending',
      comments: issue.phaseDetails?.verification?.comments || ''
    },
    etaDeadline: {
      initialDeadline: formatDateForInput(issue.phaseDetails?.etaDeadline?.initialDeadline) || '',
      extendedDeadline: formatDateForInput(issue.phaseDetails?.etaDeadline?.extendedDeadline) || '',
      isExtended: issue.phaseDetails?.etaDeadline?.isExtended || false,
      reason: issue.phaseDetails?.etaDeadline?.reason || ''
    },
    resolution: {
      status: issue.phaseDetails?.resolution?.status || 'pending',
      proof: issue.phaseDetails?.resolution?.proof || [],
      comments: issue.phaseDetails?.resolution?.comments || ''
    }
  });

  // Update state when issue changes (modal reopens)
  useEffect(() => {
    console.log('IssueDetailsModal received issue:', issue);
    setPhaseUpdate({
      verification: {
        status: issue.phaseDetails?.verification?.status || 'pending',
        comments: issue.phaseDetails?.verification?.comments || ''
      },
      etaDeadline: {
        initialDeadline: formatDateForInput(issue.phaseDetails?.etaDeadline?.initialDeadline) || '',
        extendedDeadline: formatDateForInput(issue.phaseDetails?.etaDeadline?.extendedDeadline) || '',
        isExtended: issue.phaseDetails?.etaDeadline?.isExtended || false,
        reason: issue.phaseDetails?.etaDeadline?.reason || ''
      },
      resolution: {
        status: issue.phaseDetails?.resolution?.status || 'pending',
        proof: issue.phaseDetails?.resolution?.proof || [],
        comments: issue.phaseDetails?.resolution?.comments || ''
      }
    });
  }, [issue]); // Dependency on issue ensures state updates when modal reopens

  // Always allow editing verification phase
  const canUpdateVerificationPhase = true;
  
  // Allow editing ETA phase if issue is verified
  const canUpdateEtaPhase = issue.phaseDetails?.verification?.status === 'verified' || 
                           phaseUpdate.verification.status === 'verified';
  
  // Allow editing Resolution phase if deadline is set
  const canUpdateResolutionPhase = (issue.phaseDetails?.etaDeadline?.initialDeadline || 
                                  phaseUpdate.etaDeadline.initialDeadline) && canUpdateEtaPhase;

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

  const handlePhaseUpdate = async () => {
    try {
      // Input validation
      if (!issue._id) {
        toast.error('Invalid issue ID');
        return;
      }

      let phaseData = {};

      // Format phase data based on the current phase
      switch (issue.currentPhase) {
        case 'verification':
          if (!phaseUpdate.verification.status) {
            toast.error('Please select a verification status');
            return;
          }
          phaseData = {
            status: phaseUpdate.verification.status,
            comments: phaseUpdate.verification.comments,
            verificationDate: new Date()
          };
          break;

        case 'etaDeadline':
          if (!phaseUpdate.etaDeadline.initialDeadline) {
            toast.error('Please set an initial deadline');
            return;
          }
          
          phaseData = {
            initialDeadline: phaseUpdate.etaDeadline.initialDeadline,
            isExtended: phaseUpdate.etaDeadline.isExtended,
            extendedDeadline: phaseUpdate.etaDeadline.extendedDeadline || null,
            reason: phaseUpdate.etaDeadline.reason,
            deadlineSetDate: new Date()
          };
          break;

        case 'resolution':
          if (!phaseUpdate.resolution.status) {
            toast.error('Please select a resolution status');
            return;
          }
          phaseData = {
            status: phaseUpdate.resolution.status,
            comments: phaseUpdate.resolution.comments,
            resolutionDate: new Date(),
            proof: phaseUpdate.resolution.proof
          };
          break;

        default:
          toast.error('Invalid phase selected');
          return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Updating phase...');

      try {
        console.log('Making API request with:', {
          phase: issue.currentPhase,
          phaseData
        });

        let response;
        
        // If resolution phase with files
        if (issue.currentPhase === 'resolution' && phaseUpdate.resolution.proof?.length > 0) {
          const formData = new FormData();
          formData.append('phase', issue.currentPhase);
          
          // Ensure phaseData is properly stringified
          const stringifiedPhaseData = JSON.stringify(phaseData);
          formData.append('phaseData', stringifiedPhaseData);

          // Append only File objects
          const hasNewFiles = phaseUpdate.resolution.proof.some(file => file instanceof File);
          
          if (hasNewFiles) {
            phaseUpdate.resolution.proof.forEach((file) => {
              if (file instanceof File) {
                formData.append('proof', file);
              }
            });
          } else {
            // If no new files, include existing proof URLs in phaseData
            phaseData.proof = phaseUpdate.resolution.proof;
            formData.set('phaseData', JSON.stringify(phaseData));
          }

          response = await apiClient.patch(`/issues/${issue._id}/phase`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        } else {
          // For other phases, send JSON
          response = await apiClient.patch(`/issues/${issue._id}/phase`, {
            phase: issue.currentPhase,
            phaseData
          });
        }

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        if (response) {
          console.log('Update successful, response data:', response);
          toast.success(`Successfully updated ${issue.currentPhase} phase`);
          
          if (typeof onPhaseUpdate === 'function') {
            onPhaseUpdate(response);
          }
          
          onClose();
        } else {
          throw new Error('No response data received');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        toast.dismiss(loadingToast);
        throw apiError;
      }
    } catch (error) {
      console.error('Phase update error:', error);
      
      if (error.response) {
        const serverError = error.response?.error || error.response?.message || error.message;
        console.error('Server error details:', error.response);
        toast.error(`Update failed: ${serverError}`);
      } else if (error.request) {
        console.error('Network error - no response received');
        toast.error('Network error: Please check your connection');
      } else {
        console.error('Other error:', error.message);
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  // Helper function to convert File to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhaseUpdate(prev => ({
      ...prev,
      resolution: {
        ...prev.resolution,
        proof: [...(prev.resolution.proof || []), ...files]
      }
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
                {canUpdateVerificationPhase && (
                  <div className="flex items-center space-x-2">
                    <select
                      value={phaseUpdate.verification.status}
                      onChange={(e) => setPhaseUpdate(prev => ({
                        ...prev,
                        verification: {
                          ...prev.verification,
                          status: e.target.value
                        }
                      }))}
                      className="px-3 py-1 text-sm font-medium rounded-lg border border-gray-200"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                )}
              </div>
              {canUpdateVerificationPhase && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Comments
                  </label>
                  <textarea
                    value={phaseUpdate.verification.comments}
                    onChange={(e) => setPhaseUpdate(prev => ({
                      ...prev,
                      verification: {
                        ...prev.verification,
                        comments: e.target.value
                      }
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
                    Current Deadline: {formatDateForDisplay(issue.phaseDetails?.etaDeadline?.initialDeadline)}
                    {issue.phaseDetails?.etaDeadline?.isExtended && issue.phaseDetails?.etaDeadline?.extendedDeadline && (
                      <span className="ml-2 text-amber-600">
                        (Extended to: {formatDateForDisplay(issue.phaseDetails.etaDeadline.extendedDeadline)})
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {canUpdateEtaPhase ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Set Initial Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={formatDateForInput(phaseUpdate.etaDeadline.initialDeadline)}
                      onChange={(e) => setPhaseUpdate(prev => ({
                        ...prev,
                        etaDeadline: {
                          ...prev.etaDeadline,
                          initialDeadline: e.target.value
                        }
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
                          checked={phaseUpdate.etaDeadline.isExtended}
                          onChange={(e) => setPhaseUpdate(prev => ({
                            ...prev,
                            etaDeadline: {
                              ...prev.etaDeadline,
                              isExtended: e.target.checked
                            }
                          }))}
                          className="mr-2"
                        />
                        <label htmlFor="extendDeadline" className="text-sm text-gray-700">
                          Extend Deadline (One-time only)
                        </label>
                      </div>
                      {phaseUpdate.etaDeadline.isExtended && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Extended Deadline
                            </label>
                            <input
                              type="datetime-local"
                              value={formatDateForInput(phaseUpdate.etaDeadline.extendedDeadline)}
                              onChange={(e) => setPhaseUpdate(prev => ({
                                ...prev,
                                etaDeadline: {
                                  ...prev.etaDeadline,
                                  extendedDeadline: e.target.value
                                }
                              }))}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <textarea
                            value={phaseUpdate.etaDeadline.reason}
                            onChange={(e) => setPhaseUpdate(prev => ({
                              ...prev,
                              etaDeadline: {
                                ...prev.etaDeadline,
                                reason: e.target.value
                              }
                            }))}
                            placeholder="Reason for extension..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows={2}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-amber-600 mt-2">
                  * Issue must be verified before setting deadlines
                </p>
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

              {canUpdateResolutionPhase ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resolution Status
                    </label>
                    <select
                      value={phaseUpdate.resolution.status}
                      onChange={(e) => setPhaseUpdate(prev => ({
                        ...prev,
                        resolution: {
                          ...prev.resolution,
                          status: e.target.value
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="solved">Solved</option>
                      <option value="escalated">Escalated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resolution Comments
                    </label>
                    <textarea
                      value={phaseUpdate.resolution.comments}
                      onChange={(e) => setPhaseUpdate(prev => ({
                        ...prev,
                        resolution: {
                          ...prev.resolution,
                          comments: e.target.value
                        }
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
                    {/* Display uploaded files */}
                    {phaseUpdate.resolution.proof && phaseUpdate.resolution.proof.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {phaseUpdate.resolution.proof.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={file instanceof File ? URL.createObjectURL(file) : file}
                              alt={`Proof ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => {
                                setPhaseUpdate(prev => ({
                                  ...prev,
                                  resolution: {
                                    ...prev.resolution,
                                    proof: prev.resolution.proof.filter((_, i) => i !== index)
                                  }
                                }));
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-amber-600 mt-2">
                  * Deadline must be set before updating resolution
                </p>
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
                    crossOrigin="anonymous"

                    key={index}
                    src={apiClient.defaults.baseURL+`/${photo}` }
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

          {/* Action Buttons */}
          {issue.currentPhase && (
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePhaseUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Phase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const IssueCard = ({ issue, onViewDetails, onUpdate }) => {
  const getStatusColor = (status) => {
    if (!status) return 'text-gray-600 bg-gray-50';
    
    switch (status.toLowerCase()) {
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'verified': return 'text-blue-600 bg-blue-50';
      case 'inprogress': return 'text-purple-600 bg-purple-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'highpriority': return 'text-red-600 bg-red-50';
      case 'redzone': return 'text-red-700 bg-red-100';
      case 'solved': return 'text-green-600 bg-green-50';
      case 'escalated': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get the current phase status
  const getCurrentPhaseStatus = (issue) => {
    if (!issue.phaseDetails) return 'pending';
    
    switch (issue.currentPhase) {
      case 'verification':
        return issue.phaseDetails.verification?.status || 'pending';
      case 'etaDeadline':
        return issue.phaseDetails.etaDeadline?.initialDeadline ? 'inProgress' : 'pending';
      case 'resolution':
        return issue.phaseDetails.resolution?.status || 'pending';
      default:
        return 'pending';
    }
  };

  // Format deadline for display
  const formatDeadline = (phaseDetails) => {
    if (!phaseDetails?.etaDeadline) return 'No deadline set';
    
    if (phaseDetails.etaDeadline.isExtended && phaseDetails.etaDeadline.extendedDeadline) {
      const extendedDate = new Date(phaseDetails.etaDeadline.extendedDeadline);
      return `Extended to: ${extendedDate.toLocaleString()}`;
    } else if (phaseDetails.etaDeadline.initialDeadline) {
      const initialDate = new Date(phaseDetails.etaDeadline.initialDeadline);
      return `Deadline: ${initialDate.toLocaleString()}`;
    }
    
    return 'No deadline set';
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
    _id,
    title = 'Untitled Issue',
    location = { address: 'No location specified', coordinates: { coordinates: [] } },
    currentPhase = 'verification',
    description = 'No description provided',
    createdAt = new Date(),
    upvotes = 0,
    comments = [],
    photos = [],
    reportedBy = { username: 'Anonymous' },
    phaseDetails = {
      verification: { status: 'pending' },
      etaDeadline: { isExtended: false },
      resolution: { status: 'pending', proof: [] }
    }
  } = issue;

  // Get the current status based on the phase
  const currentStatus = getCurrentPhaseStatus(issue);

  const formattedPhotos = photos.map(photo => 
    photo.startsWith('http') ? photo : `${import.meta.env.VITE_API_URL}/issues/photos/${photo}`
  );

  const handleViewDetails = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Loading issue details...');
      
      // Fetch latest issue data before showing modal
      const response = await apiClient.get(`/issues/${_id}`);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (response) {
        console.log('Fetched latest issue data:', response);
        // Pass the fresh data from the server to the parent component
        onViewDetails(response);
      } else {
        throw new Error('Failed to fetch issue details');
      }
    } catch (error) {
      console.error('Error fetching issue details:', error);
      toast.error('Failed to fetch latest issue details');
      // Only fallback to current data if fetch fails
      onViewDetails(issue);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getPhaseIcon(currentPhase)}
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">
              Reported by: {reportedBy.username}
            </p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(currentStatus)}`}>
          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
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
          {new Date(createdAt).toLocaleString()}
        </div>
      </div>

      {formattedPhotos.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2">
            {formattedPhotos.slice(0, 3).map((photo, index) => (
              <img
                crossOrigin="anonymous"
                key={index}
                
                src={photo}
                
                alt={`Issue ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

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
          <span className="text-sm">{formattedPhotos.length}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Phase: {currentPhase}</p>
            <p className="text-sm text-gray-500">
              {phaseDetails[currentPhase]?.status || 'Pending'}
            </p>
            {currentPhase === 'etaDeadline' || currentPhase === 'resolution' ? (
              <p className="text-xs text-amber-600 mt-1">
                {formatDeadline(phaseDetails)}
              </p>
            ) : null}
          </div>
          <button 
            onClick={handleViewDetails}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Manage Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export const IssueFilters = ({ onFilterChange, isLoading, onRefresh }) => {
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

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Issues in Your Area</h2>
        <div className="flex items-center space-x-2">
          {isLoading && (
            <div className="flex items-center text-blue-600">
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-sm">Loading issues...</span>
            </div>
          )}
          <button
            onClick={handleRefresh}
            className="p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50"
          >
            <Activity className="w-5 h-5" />
          </button>
        </div>
      </div>

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