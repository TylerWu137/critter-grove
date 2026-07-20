import { BrowserRouter, Routes, Route } from "react-router-dom";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import QuestsScreen from "./screens/QuestsScreen";
import CalendarScreen from "./screens/CalendarScreen";
import SettingsScreen from "./screens/SettingsScreen";
import JournalScreen from "./screens/JournalScreen";
import { ProfileProvider } from "./context/ProfileContext";
import { QuestsProvider } from "./context/QuestsContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute"; // ★ ADDED

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <QuestsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/signup" element={<SignUpScreen />} />

              {/* ★ CHANGED — every screen below now requires isLoggedIn,
                  redirecting to /login otherwise */}
              <Route
                path="/home"
                element={<ProtectedRoute><HomeScreen /></ProtectedRoute>}
              />
              <Route
                path="/quests"
                element={<ProtectedRoute><QuestsScreen /></ProtectedRoute>}
              />
              <Route
                path="/calendar"
                element={<ProtectedRoute><CalendarScreen /></ProtectedRoute>}
              />
              <Route
                path="/settings"
                element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>}
              />
              <Route
                path="/journal"
                element={<ProtectedRoute><JournalScreen /></ProtectedRoute>}
              />
            </Routes>
          </BrowserRouter>
        </QuestsProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}