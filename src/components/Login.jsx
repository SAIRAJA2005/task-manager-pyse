import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithPopup, GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';

import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  // Removed <'login' | 'signup'> type definition
  const [view, setView] = useState('login'); 

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  // Removed (code?: string) type annotation
  const getAuthMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in or reset your password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in cancelled.';
      case 'auth/missing-email':
        return 'Please enter your email address.';
      default:
        return 'Authentication failed. Please try again.';
    }
  };

  const googleLogin = async () => {
    try {
      setError('');
      await signInWithPopup(auth, googleProvider);
    } catch (err) { // Removed : any
      setError(getAuthMessage(err?.code));
    }
  };

  // Removed : React.FormEvent
  const signup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      alert('Verification email sent! Check your inbox (including spam).');
    } catch (err) { // Removed : any
      setError(getAuthMessage(err?.code));
      // Auto-switch to login if email already exists
      if (err?.code === 'auth/email-already-in-use') {
        setTimeout(() => setView('login'), 2000);
      }
    }
  };

  // Removed : React.FormEvent
  const login = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { // Removed : any
      setError(getAuthMessage(err?.code));
    }
  };

  const forgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Check your inbox.');
    } catch (err) { // Removed : any
      setError(getAuthMessage(err?.code));
    }
  };

  return (
    <div className="login-container">
      <h1>Task Manager</h1>
      <div className="login-box">
            <button onClick={googleLogin} className="google-btn">
              <FcGoogle size={20} style={{ marginRight: "8px" }} />
              Login with Google
            </button>
        <div className="divider">or</div>

        {view === 'signup' ? (
          <form onSubmit={signup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Create Account</button>
          </form>
        ) : (
          <form onSubmit={login}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <button type="button" onClick={forgotPassword} className="forgot-btn">
              Forgot Password?
            </button>
          </form>
        )}

        <div className="switch-view">
          {view === 'login' ? (
            <button type="button" onClick={() => setView('signup')}>
              Need account? Sign Up
            </button>
          ) : (
            <button type="button" onClick={() => setView('login')}>
              Have account? Login
            </button>
          )}
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
