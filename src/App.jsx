import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Pages
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ProfilePage from './features/auth/ProfilePage';

import GuidesListPage from './features/listings/GuidesListPage';
import HotelsListPage from './features/listings/HotelsListPage';
import RoomsListPage from './features/listings/RoomsListPage';
import PackagesListPage from './features/listings/PackagesListPage';
import CreateGuideProfilePage from './features/listings/CreateGuideProfilePage';
import CreateHotelProfilePage from './features/listings/CreateHotelProfilePage';
import CreateRoomPage from './features/listings/CreateRoomPage';
import CreatePackagePage from './features/listings/CreatePackagePage';

import BookRoomPage from './features/booking/BookRoomPage';
import BookPackagePage from './features/booking/BookPackagePage';
import MyRoomBookingsPage from './features/booking/MyRoomBookingsPage';
import MyPackageBookingsPage from './features/booking/MyPackageBookingsPage';

import ConversationListPage from './features/chat/ConversationListPage';
import ChatRoomPage from './features/chat/ChatRoomPage';

import NotificationsPage from './features/notifications/NotificationsPage';

function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/hotels" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/hotels" element={<HotelsListPage />} />
          <Route path="/hotels/:id/rooms" element={<RoomsListPage />} />
          <Route path="/guides" element={<GuidesListPage />} />
          <Route path="/packages" element={<PackagesListPage />} />

          {/* Protected Routes (All authenticated users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/conversations" element={<ConversationListPage />} />
            <Route path="/conversations/:id" element={<ChatRoomPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Traveler Routes */}
          <Route element={<RoleRoute allowedRoles={['traveler']} />}>
            <Route path="/book-room/:id" element={<BookRoomPage />} />
            <Route path="/book-package/:id" element={<BookPackagePage />} />
            <Route path="/my-room-bookings" element={<MyRoomBookingsPage />} />
            <Route path="/my-package-bookings" element={<MyPackageBookingsPage />} />
          </Route>

          {/* Guide Routes */}
          <Route element={<RoleRoute allowedRoles={['guide']} />}>
            <Route path="/create-guide-profile" element={<CreateGuideProfilePage />} />
            <Route path="/create-package" element={<CreatePackagePage />} />
          </Route>

          {/* Hotel Routes */}
          <Route element={<RoleRoute allowedRoles={['hotel']} />}>
            <Route path="/create-hotel-profile" element={<CreateHotelProfilePage />} />
            <Route path="/create-room" element={<CreateRoomPage />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
