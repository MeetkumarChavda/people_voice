import React, { useState } from 'react';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingIcon,
  EditIcon,
  KeyIcon,
  SaveIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'John Doe',
    email: currentUser?.email || 'john.doe@cityfix.com',
    phone: currentUser?.phone || '+91 98765 43210',
    designation: currentUser?.designation || 'Municipal Administrator',
    department: currentUser?.department || 'City Planning',
    location: currentUser?.location || 'City Hall, Main Street',
  });

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    // Here you would make an API call to change the password
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    toast.success('Password changed successfully');
  };

  const handle2FASetup = () => {
    // Here you would handle 2FA setup
    setShow2FAModal(false);
    toast.success('2FA setup initiated');
  };

  const renderPasswordModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          <button
            onClick={() => setShowPasswordModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword.current ? (
                  <EyeOffIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword.new ? (
                  <EyeOffIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword.confirm ? (
                  <EyeOffIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordChange}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const render2FAModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-medium text-gray-900">Setup Two-Factor Authentication</h3>
          <button
            onClick={() => setShow2FAModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Two-factor authentication adds an extra layer of security to your account. You'll need to enter a code from your authenticator app in addition to your password when signing in.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Setup Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
              <li>Scan the QR code or enter the setup key manually</li>
              <li>Enter the verification code to complete setup</li>
            </ol>
          </div>

          <button
            onClick={handle2FASetup}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Begin Setup
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          {isEditing ? (
            <>
              <XIcon className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <EditIcon className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                  {profileData.name.charAt(0)}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                  />
                ) : (
                  <div>
                    <p className="font-medium text-gray-900">{profileData.name}</p>
                    <p className="text-sm text-gray-500">{profileData.designation}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MailIcon className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-600">{profileData.email}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-600">{profileData.phone}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Work Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <BuildingIcon className="w-5 h-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                  />
                ) : (
                  <span className="text-gray-600">{profileData.department}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                  />
                ) : (
                  <span className="text-gray-600">{profileData.location}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <KeyIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShow2FAModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && renderPasswordModal()}
      {show2FAModal && render2FAModal()}
    </div>
  );
};

export default Profile; 