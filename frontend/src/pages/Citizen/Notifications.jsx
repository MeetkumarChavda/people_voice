import React, { useState } from 'react';
import {
  BellIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  MapPinIcon,
  MessageCircleIcon,
  ThumbsUpIcon,
  CogIcon,
  UserCircleIcon,
  HomeIcon,
  MapIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  // Dummy notifications data
  const notifications = [
    {
      id: 1,
      type: 'status',
      title: 'Issue Status Updated',
      description: 'Your reported issue "Street Light Malfunction" has been verified',
      time: '2 hours ago',
      isRead: false,
      issueId: '123',
      status: 'verified'
    },
    {
      id: 2,
      type: 'comment',
      title: 'New Comment',
      description: 'Municipal Officer responded to your issue about water supply',
      time: '5 hours ago',
      isRead: true,
      issueId: '124'
    },
    {
      id: 3,
      type: 'upvote',
      title: 'New Upvotes',
      description: '5 people upvoted your reported issue about road maintenance',
      time: '1 day ago',
      isRead: true,
      issueId: '125'
    },
    {
      id: 4,
      type: 'assignment',
      title: 'Issue Assigned',
      description: 'Your issue has been assigned to Electrical Department',
      time: '2 days ago',
      isRead: false,
      issueId: '126'
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'status':
        return <CheckCircleIcon size={20} className="text-green-500" />;
      case 'comment':
        return <MessageCircleIcon size={20} className="text-blue-500" />;
      case 'upvote':
        return <ThumbsUpIcon size={20} className="text-purple-500" />;
      case 'assignment':
        return <AlertCircleIcon size={20} className="text-amber-500" />;
      default:
        return <InfoIcon size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 py-3 px-4 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <div className="font-bold text-xl">Notifications</div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-blue-700 transition-colors">
            <CogIcon size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg p-2 mb-6 flex space-x-2 shadow-sm">
          {['all', 'unread', 'status', 'comments', 'upvotes'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all ${
                !notification.isRead ? 'border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">{notification.title}</h3>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <button 
                      onClick={() => navigate(`/issue/${notification.issueId}`)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <InfoIcon size={16} className="mr-1" />
                      View Issue
                    </button>
                    {notification.type === 'status' && (
                      <button className="text-sm text-purple-600 hover:text-purple-800 flex items-center">
                        <MapPinIcon size={16} className="mr-1" />
                        View on Map
                      </button>
                    )}
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
          <button 
            onClick={() => navigate('/profile')}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <UserCircleIcon size={24} />
          </button>
          <button className="p-2 text-blue-600">
            <BellIcon size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 