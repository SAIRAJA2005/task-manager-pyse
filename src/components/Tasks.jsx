
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Profile from './Profile';

// const API_URL = 'https://us-central1-task-manager-pyse.cloudfunctions.net/api';

const API_URL = 'https://api-x7soypxmha-uc.a.run.app';

export default function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitialFromEmail = (email) => {
    return email?.charAt(0).toUpperCase() || '?';
  };

  const getAvatarColor = (email) => {
    const colors = ['#044148', '#093665', '#0a5a7d', '#0d4d6b', '#083952'];
    const index = email?.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks?userId=${user.uid}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await fetch(`${API_URL}/addTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: {
            title: newTask.trim(),
            completed: false,
            userId: user.uid,
            createdAt: new Date()
          }
        })
      });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Add error:', error);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await fetch(`${API_URL}/updateTask`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !completed, userId: user.uid })
      });
      setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !completed } : t));
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/deleteTask`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, userId: user.uid })
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const openProfile = () => {
    setShowProfile(true);
    setMobileMenuOpen(false);
  };

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="tasks-container">
      <div className="header">
        <div className="header-left">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="profile-img" 
              onClick={openProfile}
            />
          ) : (
            <div 
              className="profile-img profile-img-initial"
              style={{
                backgroundColor: getAvatarColor(user.email),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                cursor: 'pointer'
              }}
              onClick={openProfile}
            >
              {getInitialFromEmail(user.email)}
            </div>
          )}
          <div className="header-info">
              <h1 className="app-title">Focus Desk</h1>
              <p className="tagline">Your personal task manager</p>
          </div>
        </div>

        <div className="header-actions">
          <button onClick={openProfile} className="profile-btn">
            Profile
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <button 
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <button onClick={openProfile} className="profile-btn">
          👤 Profile
        </button>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>

      {showProfile && (
        <Profile user={user} onClose={() => setShowProfile(false)} tasks={tasks} />
      )}

      <form onSubmit={addTask} className="add-task-form">
        <input 
          type="text" 
          placeholder="Add new task..." 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>🎉 No tasks yet!</h3>
            <p>Add your first task above 👆</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-item">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTask(task.id, task.completed)}
              />
              <span className={task.completed ? 'completed' : ''}>
                {task.title}
              </span>
              <button onClick={() => deleteTask(task.id)}>🗑️ Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
