import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/ui/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup(fullName, email, password);
      // Successful auth routes to app console automatically
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Registration failed. Please check your inputs and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={
        <>
          Join the <span className="text-secondary">Revolution</span>
        </>
      }
      description="Create your account to unlock advanced sign language translation across devices. Your digital inclusivity starts here."
      badge="Early Access"
      footerLink={{
        copy: "Already have an account?",
        to: '/login',
        label: 'Log in',
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="fullName"
          label="Full Name"
          type="text"
          autoComplete="name"
          required
          placeholder="Alex Rivera"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          placeholder="alex@signbridge.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="Must be at least 8 characters long."
        />
        
        {error && (
          <div className="rounded-lg bg-danger/10 p-4 text-sm text-danger border border-danger/20">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}
