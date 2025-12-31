import React, { useState } from 'react';
import { auth } from '../firebase';
import { updateProfile, updatePassword, sendEmailVerification } from 'firebase/auth';

// Removed : any from props
export default function Profile({ user, onClose, tasks }) {
  // Removed <'profile' | 'edit' | 'settings'> type
  const [view, setView] = useState('profile');
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract first letter from email (removed : string)
  const getInitialFromEmail = (email) => {
    return email?.charAt(0).toUpperCase() || '?';
  };

  // Generate a background color based on email (removed : string)
  const getAvatarColor = (email) => {
    const colors = ['#044148', '#093665', '#0a5a7d', '#0d4d6b', '#083952'];
    const index = email?.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Calculate task stats
  const totalTasks = tasks?.length || 0;
  // Removed : any from filter
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Removed : React.FormEvent
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim() || null
        });
        setMessage('Profile updated successfully! ✅');
        setTimeout(() => {
          setView('profile');
          setMessage('');
        }, 2000);
      }
    } catch (err) { // Removed : any
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Removed : React.FormEvent
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters!');
      setLoading(false);
      return;
    }

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setMessage('Password updated successfully! ✅');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (err) { // Removed : any
      if (err.code === 'auth/requires-recent-login') {
        setError('Please log out and log back in to change your password.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (auth.currentUser && !user.emailVerified) {
        await sendEmailVerification(auth.currentUser);
        setMessage('Verification email sent! Check your inbox. 📧');
      }
    } catch (err) { // Removed : any
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container-enhanced">
      <div className="profile-backdrop-enhanced" onClick={onClose}></div>
      <div className="profile-card-enhanced">
        {/* Close Button */}
        <button className="profile-close-btn" onClick={onClose}>×</button>

        {/* NEW: Scrollable content wrapper */}
        <div className="profile-card-content">
          {view === 'profile' && (
            <>
              {/* Header with Avatar */}
              <div className="profile-header-enhanced">
                <div className="avatar-wrapper">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="profile-avatar-large" 
                    />
                  ) : (
                    <div 
                      className="profile-avatar-large profile-initial-large"
                      style={{
                        backgroundColor: getAvatarColor(user.email),
                      }}
                    >
                      {getInitialFromEmail(user.email)}
                    </div>
                  )}
                  <div className="avatar-glow-effect"></div>
                </div>
                
                <div className="status-badge-enhanced">
                  {user.emailVerified ? (
                    <span className="verified">✓ Verified</span>
                  ) : (
                    <span className="pending">⚠ Unverified</span>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="profile-info-enhanced">
                <h1 className="profile-name-enhanced">
                  {user.displayName || 'Awesome User'}
                </h1>
                <p className="profile-email-enhanced">{user.email}</p>
              </div>

              {/* Task Stats Section */}
              <div className="task-stats-section">
                <h3 className="stats-section-title">Task Statistics</h3>
                <div className="progress-container">
                  <div className="progress-info">
                    <span className="progress-label">Completion Rate</span>
                    <span className="progress-percentage">{completionRate}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="task-stats-grid">
                  <div className="task-stat-card total">
                    <div className="task-stat-icon">📋</div>
                    <div className="task-stat-info">
                      <div className="task-stat-number">{totalTasks}</div>
                      <div className="task-stat-label">Total Tasks</div>
                    </div>
                  </div>
                  
                  <div className="task-stat-card completed">
                    <div className="task-stat-icon">✅</div>
                    <div className="task-stat-info">
                      <div className="task-stat-number">{completedTasks}</div>
                      <div className="task-stat-label">Completed</div>
                    </div>
                  </div>
                  
                  <div className="task-stat-card pending">
                    <div className="task-stat-icon">⏳</div>
                    <div className="task-stat-info">
                      <div className="task-stat-number">{pendingTasks}</div>
                      <div className="task-stat-label">Pending</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid-enhanced">
                <div className="stat-card-enhanced">
                  <div className="stat-icon">👤</div>
                  <div className="stat-content">
                    <div className="stat-label">User ID</div>
                    <div className="stat-value">{user.uid.slice(0, 8)}...</div>
                  </div>
                </div>
                
                <div className="stat-card-enhanced">
                  <div className="stat-icon">🔐</div>
                  <div className="stat-content">
                    <div className="stat-label">Provider</div>
                    <div className="stat-value">
                      {user.providerData[0]?.providerId?.replace('.com', '') || 'Email'}
                    </div>
                  </div>
                </div>
                
                <div className="stat-card-enhanced">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <div className="stat-label">Member Since</div>
                    <div className="stat-value">
                      {new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <div className="stat-card-enhanced">
                  <div className="stat-icon">🕒</div>
                  <div className="stat-content">
                    <div className="stat-label">Last Sign In</div>
                    <div className="stat-value">
                      {new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="profile-actions-enhanced">
                <button className="action-btn-enhanced primary-action" onClick={() => setView('edit')}>
                  ✏️ Edit Profile
                </button>
                <button className="action-btn-enhanced secondary-action" onClick={() => setView('settings')}>
                  ⚙️ Settings
                </button>
              </div>
            </>
          )}

          {view === 'edit' && (
            <div className="edit-view">
              <button className="back-btn" onClick={() => setView('profile')}>← Back</button>
              <h2 className="view-title">Edit Profile</h2>
              
              <form onSubmit={handleUpdateProfile} className="edit-form">
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="profile-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email (Cannot be changed)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="profile-input disabled"
                  />
                </div>

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {view === 'settings' && (
            <div className="settings-view">
              <button className="back-btn" onClick={() => setView('profile')}>← Back</button>
              <h2 className="view-title">⚙️ Settings</h2>

              {/* Email Verification Card */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="settings-card-icon">📧</div>
                  <h3 className="settings-card-title">Email Verification</h3>
                </div>
                <div className="settings-card-content">
                  {user.emailVerified ? (
                    <div className="verification-status verified">
                      <span className="status-icon">✅</span>
                      <span className="status-text">Your email is verified!</span>
                    </div>
                  ) : (
                    <>
                      <div className="verification-status unverified">
                        <span className="status-icon">⚠️</span>
                        <span className="status-text">Email not verified</span>
                      </div>
                      <p className="settings-description">
                        Verify your email to unlock all features and secure your account.
                      </p>
                      <button 
                        onClick={handleSendVerification} 
                        className="settings-action-btn"
                        disabled={loading}
                      >
                        {loading ? 'Sending...' : '📨 Send Verification Email'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Password Management Card */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="settings-card-icon">🔒</div>
                  <h3 className="settings-card-title">Password & Security</h3>
                </div>
                <div className="settings-card-content">
                  {user.providerData[0]?.providerId === 'password' ? (
                    <form onSubmit={handleUpdatePassword} className="settings-form">
                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min 6 characters)"
                          className="profile-input"
                          minLength={6}
                        />
                      </div>

                      <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="profile-input"
                          minLength={6}
                        />
                      </div>

                      <button type="submit" className="settings-action-btn" disabled={loading}>
                        {loading ? 'Updating...' : '🔐 Update Password'}
                      </button>
                    </form>
                  ) : (
                    <div className="google-auth-notice">
                      <div className="notice-icon">🔐</div>
                      <p className="notice-text">
                        You're signed in with <strong>Google</strong>. Password changes are managed through your Google account.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Info Card */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="settings-card-icon">ℹ️</div>
                  <h3 className="settings-card-title">Account Information</h3>
                </div>
                <div className="settings-card-content">
                  <div className="info-row">
                    <span className="info-label">Account Created</span>
                    <span className="info-value">
                      {new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Last Sign In</span>
                    <span className="info-value">
                      {new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">User ID</span>
                    <span className="info-value monospace">{user.uid.slice(0, 16)}...</span>
                  </div>
                </div>
              </div>

              {message && <div className="success-message">{message}</div>}
              {error && <div className="error-message">{error}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
