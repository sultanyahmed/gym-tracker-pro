import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import Classes from './pages/Classes';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, initAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication state on app load
    initAuth();
  }, [initAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            {user ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/profile" element={<Profile />} />
              </>
            ) : null}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;