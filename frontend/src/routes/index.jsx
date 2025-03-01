import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CitizenFeed from '../pages/Citizen/CitizenFeed';
import Profile from '../pages/Citizen/Profile';
import Notifications from '../pages/Citizen/Notifications';
import MyReports from '../pages/Citizen/MyReports';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CitizenFeed />} />
      <Route path="/feed" element={<CitizenFeed />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/my-reports" element={<MyReports />} />
      <Route path="/issue/:id" element={<CitizenFeed />} />
    </Routes>
  );
};

export default AppRoutes; 