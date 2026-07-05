import { BrowserRouter, Routes, Route } from "react-router-dom";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import QuestsScreen from "./screens/QuestsScreen";
import CalendarScreen from "./screens/CalendarScreen";
import SettingsScreen from "./screens/SettingsScreen";
import JournalScreen from "./screens/JournalScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/quests" element={<QuestsScreen />} />
        <Route path="/calendar" element={<CalendarScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/journal" element={<JournalScreen />} />
      </Routes>
    </BrowserRouter>
  );
}