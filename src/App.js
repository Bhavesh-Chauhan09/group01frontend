import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom'; // Use useNavigate here
import ErrorBoundary from './ErrorBoundary';
import Goals from './components/Goals';
import Metrics from './components/Metrics';
import WorkoutList from './components/WorkoutList';
import AccountSettings from './components/AccountSettings';
import Login from './components/Login';
import Register from './components/Register';
import Workouts from './components/Workouts';
import logo from './components/q2.png';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [refreshWorkouts, setRefreshWorkouts] = useState(false); // State to control workout refresh
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    // Retrieve user data from local storage if already logged in
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  // Function to refresh workouts, can be called after updating settings
  const triggerWorkoutRefresh = () => {
    setRefreshWorkouts(prev => !prev); // Toggle refresh state to trigger re-fetch
  };

  return (
    <div className="App" style={{ fontFamily: 'monospace' }}>
      <header className="app-header">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="FitTrack Logo" className="logo" />
          </Link>
          <h1 className="logo-text">
            <Link to="/" className="logo-link">FitTrack</Link>
          </h1>
        </div>
        <nav className="header-buttons">
          {user ? (
            <>
              <span className="user-name">Welcome, {user.username}</span>
              <Link to="/account-settings">
                <button className="nav-button account-settings">Account Settings</button>
              </Link>
              <button onClick={handleLogout} className="nav-button logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="nav-button login">Login</button>
              </Link>
              <Link to="/register">
                <button className="nav-button register">Register</button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <section className="recent-workouts">
                <h2>My Workouts</h2>
                <WorkoutList userId={user ? user.id : null} refresh={refreshWorkouts} />
              </section>
              <ErrorBoundary>
                <Goals userId={user ? user.id : null} />
              </ErrorBoundary>
              <ErrorBoundary>
                <Metrics />
              </ErrorBoundary>
            </>
          } />
          <Route path="/workouts" element={
            <>
              <section className="recent-workouts">
                <h2>Workouts</h2>
                <Workouts userId={user ? user.id : null} triggerWorkoutRefresh={triggerWorkoutRefresh} />
              </section>
              <ErrorBoundary>
                <Goals userId={user ? user.id : null} />
              </ErrorBoundary>
              <ErrorBoundary>
                <Metrics />
              </ErrorBoundary>
            </>
          } />
          <Route path="/account-settings" element={<AccountSettings onSettingsUpdate={triggerWorkoutRefresh} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>MITWPU - CSE Project.</p>
      </footer>
    </div>
  );
}

export default App;
