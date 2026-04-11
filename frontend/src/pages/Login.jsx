import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/ui/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../services/api';
import { ENDPOINTS } from '../utils/constants';

const stats = [
  { value: '3', label: 'input modes' },
  { value: '20k+', label: 'translations' },
  { value: '24/7', label: 'practice' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post(ENDPOINTS.LOGIN, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      localStorage.setItem('token', response.data.access_token);

      try {
        const userResponse = await api.get(ENDPOINTS.ME);
        localStorage.setItem('user', JSON.stringify(userResponse.data));
      } catch (userError) {
        console.error('Failed to fetch user details', userError);
        localStorage.setItem('user', JSON.stringify({ full_name: 'User', email }));
      }

      navigate('/dashboard');
    } catch (loginError) {
      setError(loginError.response?.data?.detail || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Welcome back"
      description="Pick up your translation sessions, saved phrases, and accessibility tools from one consistent workspace."
      footerLink={{ copy: "Don't have an account?", label: 'Create one', to: '/signup' }}
      stat={stats}
      title="Continue building accessible conversations."
    >
      <div className="mb-8 space-y-3 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
          <span className="material-symbols-outlined material-filled text-3xl">login</span>
        </div>
        <h2 className="text-3xl font-bold text-ink">Sign in</h2>
        <p className="text-sm leading-6 text-muted">Use your Sign Bridge account to continue.</p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm font-medium text-danger" role="alert">
          {error}
        </div>
      )}

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          id="login-email"
          label="Email address"
          placeholder="name@company.com"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label className="block text-sm font-semibold text-ink" htmlFor="login-password">
              Password
            </label>
            <Link className="text-sm font-semibold text-primary hover:text-accent" to="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <Input
            autoComplete="current-password"
            id="login-password"
            inputClassName="mt-0"
            placeholder="Enter your password"
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="my-8 flex items-center gap-4" aria-hidden="true">
        <div className="h-px flex-1 bg-outline" />
        <span className="text-sm text-subtle">or</span>
        <div className="h-px flex-1 bg-outline" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button className="w-full" type="button" variant="secondary">
          <span className="material-symbols-outlined mr-2 text-xl">travel_explore</span>
          Google
        </Button>
        <Button className="w-full" type="button" variant="secondary">
          <span className="material-symbols-outlined mr-2 text-xl">terminal</span>
          GitHub
        </Button>
      </div>
    </AuthLayout>
  );
}
