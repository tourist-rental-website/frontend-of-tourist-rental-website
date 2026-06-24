/**
 * App.jsx — Root Application Component
 *
 * Defines all routes for the TouristHelper platform.
 * Routes are organized into 4 groups:
 *
 *   1. Public routes      — Accessible to everyone (login, register, browse listings)
 *   2. Protected routes   — Require authentication (profile, chat, notifications)
 *   3. Traveler routes    — Require role="traveler" (booking pages)
 *   4. Guide routes       — Require role="guide" (create guide profile, packages)
 *   5. Hotel routes       — Require role="hotel" (create hotel profile, rooms)
 *
 * ProtectedRoute and RoleRoute are "layout routes" — they wrap child routes
 * and render <Outlet /> only if the access check passes.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// Auth pages
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ProfilePage from "./features/auth/ProfilePage";

// Listing pages (public browsing + role-gated creation)
// FIX: Import paths corrected — files are in features/listings/ (not features/listings/create/)
import GuidesListPage from "./features/listings/GuidesListPage";
import HotelsListPage from "./features/listings/HotelsListPage";
import RoomsListPage from "./features/listings/RoomsListPage";
import PackagesListPage from "./features/listings/PackagesListPage";
import CreateGuideProfilePage from "./features/listings/CreateGuideProfilePage";
import CreateHotelProfilePage from "./features/listings/CreateHotelProfilePage";
import CreateRoomPage from "./features/listings/CreateRoomPage";
import CreatePackagePage from "./features/listings/CreatePackagePage";

// Booking pages (traveler only)
import BookRoomPage from "./features/booking/BookRoomPage";
import BookPackagePage from "./features/booking/BookPackagePage";
import MyRoomBookingsPage from "./features/booking/MyRoomBookingsPage";
import MyPackageBookingsPage from "./features/booking/MyPackageBookingsPage";

// Chat pages (any authenticated user)
import ConversationListPage from "./features/chat/ConversationListPage";
import ChatRoomPage from "./features/chat/ChatRoomPage";

// Notification page (any authenticated user)
import NotificationsPage from "./features/notifications/NotificationsPage";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          {/* ============================================================= */}
          {/* Public Routes — No authentication required                     */}
          {/* ============================================================= */}
          <Route path="/" element={<Navigate to="/hotels" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/hotels" element={<HotelsListPage />} />
          <Route path="/hotels/:id/rooms" element={<RoomsListPage />} />
          <Route path="/guides" element={<GuidesListPage />} />
          <Route path="/packages" element={<PackagesListPage />} />

          {/* ============================================================= */}
          {/* Protected Routes — Any authenticated user                      */}
          {/* ============================================================= */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/conversations" element={<ConversationListPage />} />
            <Route path="/conversations/:id" element={<ChatRoomPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          {/* ============================================================= */}
          {/* Traveler Routes — role="traveler" only                         */}
          {/* ============================================================= */}
          <Route element={<RoleRoute allowedRoles={["traveler"]} />}>
            <Route path="/book-room/:id" element={<BookRoomPage />} />
            <Route path="/book-package/:id" element={<BookPackagePage />} />
            <Route path="/my-room-bookings" element={<MyRoomBookingsPage />} />
            <Route path="/my-package-bookings" element={<MyPackageBookingsPage />} />
          </Route>

          {/* ============================================================= */}
          {/* Guide Routes — role="guide" only                               */}
          {/* ============================================================= */}
          <Route element={<RoleRoute allowedRoles={["guide"]} />}>
            <Route path="/create-guide-profile" element={<CreateGuideProfilePage />} />
            <Route path="/create-package" element={<CreatePackagePage />} />
          </Route>

          {/* ============================================================= */}
          {/* Hotel Routes — role="hotel" only                               */}
          {/* ============================================================= */}
          <Route element={<RoleRoute allowedRoles={["hotel"]} />}>
            <Route path="/create-hotel-profile" element={<CreateHotelProfilePage />} />
            <Route path="/create-room" element={<CreateRoomPage />} />
          </Route>

          {/* ============================================================= */}
          {/* Fallback — Redirect unknown routes to home                     */}
          {/* ============================================================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
