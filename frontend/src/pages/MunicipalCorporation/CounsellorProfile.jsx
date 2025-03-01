import React from 'react';
import {
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  BarChart3Icon,
  StarIcon,
  XIcon,
} from 'lucide-react';

const CounsellorProfile = ({ counsellor, onClose }) => {
  const performanceMetrics = {
    issuesResolved: 85,
    averageResponseTime: '24 hours',
    citizenSatisfaction: 4.8,
    activeIssues: 12,
  };

  const recentActivity = [
    {
      type: 'issue_resolved',
      title: 'Street Light Repair',
      date: '2024-03-10',
      location: 'Sector 7, Block C',
    },
    {
      type: 'issue_assigned',
      title: 'Garbage Collection',
      date: '2024-03-09',
      location: 'Sector 7, Block A',
    },
    {
      type: 'citizen_feedback',
      title: 'Road Maintenance',
      date: '2024-03-08',
      rating: 5,
      comment: 'Quick and efficient resolution',
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm"></div>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative z-50 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-medium">
              {counsellor.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{counsellor.name}</h2>
              <p className="text-gray-500">Area Counsellor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{counsellor.area}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{counsellor.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MailIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{counsellor.email}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Issues Resolved</span>
                    <span className="font-medium text-gray-900">{performanceMetrics.issuesResolved}%</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${performanceMetrics.issuesResolved}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Response Time</span>
                  <span className="font-medium text-gray-900">{performanceMetrics.averageResponseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Citizen Satisfaction</span>
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-medium text-gray-900">{performanceMetrics.citizenSatisfaction}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Issues</span>
                  <span className="font-medium text-gray-900">{performanceMetrics.activeIssues}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-2">
            <h3 className="font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'issue_resolved' 
                        ? 'bg-green-100' 
                        : activity.type === 'issue_assigned'
                        ? 'bg-blue-100'
                        : 'bg-yellow-100'
                    }`}>
                      {activity.type === 'issue_resolved' ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      ) : activity.type === 'issue_assigned' ? (
                        <ClockIcon className="w-5 h-5 text-blue-600" />
                      ) : (
                        <StarIcon className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <span className="text-sm text-gray-500">{activity.date}</span>
                      </div>
                      {activity.location && (
                        <p className="text-sm text-gray-600 mt-1">
                          <MapPinIcon className="w-4 h-4 inline mr-1" />
                          {activity.location}
                        </p>
                      )}
                      {activity.rating && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(activity.rating)].map((_, i) => (
                              <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.comment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorProfile; 