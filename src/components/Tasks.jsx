import React, { useState, useEffect } from 'react';
import { 
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy 
} from 'firebase/firestore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { db } from '../firebase';
import Profile from './Profile';

// Removed : any from props
export default function Tasks({ user }) {
  // Removed <any[]> generic type
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper functions for avatar (removed : string)
  const getInitialFromEmail = (email) => {
    return email?.charAt(0).toUpperCase() || '?';
  };

  // Removed : string
  const getAvatarColor = (email) => {
    const colors = ['#044148', '#093665', '#0a5a7d', '#0d4d6b', '#083952'];
    const index = email?.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const fetchTasks = async () => {
    try {
      const q = query(collection(db, `users/${user.uid}/tasks`), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      // Removed : any
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
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

  // Removed : React.FormEvent
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/tasks`), {
        title: newTask.trim(),
        completed: false,
        createdAt: new Date()
      });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Add error:', error);
    }
  };

  // Removed types from parameters
  const toggleTask = async (id, completed) => {
    try {
      await updateDoc(doc(db, `users/${user.uid}/tasks`, id), { completed: !completed });
      // Removed : any
      setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !completed } : t));
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  // Removed types from parameters
  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/tasks`, id));
      // Removed : any
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
      {/* Header */}
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

        {/* Desktop Menu */}
        <div className="header-actions">
          <button onClick={openProfile} className="profile-btn">
            Profile
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <button onClick={openProfile} className="profile-btn">
          👤 Profile
        </button>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <Profile user={user} onClose={() => setShowProfile(false)} tasks={tasks} />
      )}

      {/* Add Task Form */}
      <form onSubmit={addTask} className="add-task-form">
        <input 
          type="text" 
          placeholder="Add new task..." 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Tasks List */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>🎉 No tasks yet!</h3>
            <p>Add your first task above 👆</p>
          </div>
        ) : (
          tasks.map((task) => ( // Removed : any
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
