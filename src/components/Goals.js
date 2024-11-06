import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import AddGoal from './AddGoal';
import './Goals.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Goals = ({ userId }) => {
  const [goals, setGoals] = useState([]);
  const [totalTarget, setTotalTarget] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [areGoalsVisible, setAreGoalsVisible] = useState(false); // For toggling the visibility of goals
  const [popupMessage, setPopupMessage] = useState(''); // Popup message state

  useEffect(() => {
    if (userId) {
      fetchGoals(userId);
    }
  }, [userId]);

  const fetchGoals = async (userId) => {
    try {
      const response = await fetch(`https://group01-1.onrender.com/api/goals/${userId}`);
      if (response.ok) {
        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          const totalTarget = data.reduce((sum, goal) => sum + (goal.totalgoals || 0), 0);
          const totalProgress = data.reduce((sum, goal) => sum + (goal.progress || 0), 0);
          
          setGoals(data);
          setTotalTarget(totalTarget);
          setTotalProgress(totalProgress);
        } else {
          console.error('Fetched data is not an array.');
          setGoals([]); // In case of invalid data, reset to an empty array
        }
      } else {
        console.error('Failed to fetch goals:', response.status);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const addGoal = async (newGoal) => {
    try {
      const response = await fetch(`https://group01-1.onrender.com/api/goals/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGoal),
      });
      if (response.ok) {
        await fetchGoals(userId); // Refresh goals list
        setPopupMessage('Goal added successfully!'); // Show success message
        setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
      } else {
        setPopupMessage('Failed to add goal'); // Show error message
        setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const response = await fetch(`https://group01-1.onrender.com/api/goals/${goalId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchGoals(userId); // Refresh the goals after deletion
        setPopupMessage('Goal deleted successfully!'); // Show success message
        setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
      } else {
        setPopupMessage('Failed to delete goal'); // Show error message
        setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const pieData = {
    labels: ['Achieved', 'Remaining'],
    datasets: [
      {
        data: [totalProgress, totalTarget - totalProgress],
        backgroundColor: ['#ff9999', '#ff3333'],
        hoverBackgroundColor: ['#ff6666', '#ff0000'],
      },
    ],
  };

  const barData = {
    labels: goals.map(goal => `Day ${goal.day}`),
    datasets: [
      {
        label: 'Distance',
        backgroundColor: '#ff3333',
        data: goals.map(goal => goal.distance),
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y', // Set the bar chart to horizontal
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        max: Math.max(...barData.datasets[0].data) + 2,
      },
      y: {
        title: {
          display: true,
          text: 'Days',
        },
      },
    },
  };

  return (
    <section className="goals">
      <h2>Goals</h2>
      <AddGoal userId={userId} fetchGoals={() => fetchGoals(userId)} addGoal={addGoal} /> {/* Pass addGoal function to AddGoal */}
      
      <div className="chart-container">
        <h3>Achievements</h3>
        {totalTarget > 0 ? (
          <Pie data={pieData} />
        ) : (
          <p>No goals added yet.</p>
        )}
      </div>
      <div className="chart-container">
        <h3>Daily Progress</h3>
        <Bar data={barData} options={barOptions} />
      </div>

      <button 
        className="toggle-goals-btn" 
        onClick={() => setAreGoalsVisible(!areGoalsVisible)}
      >
        {areGoalsVisible ? 'Hide Current Goals' : 'Show Current Goals'}
      </button>

      {areGoalsVisible && (
        <div className="goals-list">
          <h3>Current Goals</h3>
          <ul>
            {goals.map((goal) => (
              <li key={goal._id} className="goal-item">
                <span>Day {goal.day} - {goal.distance} km</span>
                <button 
                  className="delete-btn" 
                  onClick={() => deleteGoal(goal._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popup Message */}
      {popupMessage && <div className="popup">{popupMessage}</div>}
    </section>
  );
};

export default Goals;
