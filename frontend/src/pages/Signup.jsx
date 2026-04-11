import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/ui/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../services/api';
import { ENDPOINTS } from '../utils/constants';

const stats = [
  { value: '2k+', label: 'pioneers' },
  { value: '98%', label: 'target clarity' },
  { value: '3 min', label: 'setup' },
];

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await api.post(ENDPOINTS.REGISTER, formData);
      navigate('/login');
    } catch (signupError) {
      setError(signupError.response?.data?.detail || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Next-gen accessibility"
      description="Create a Sign Bridge workspace for sign recognition, text-to-sign playback, and communication history with one polished interface."
      footerLink={{ copy: 'Already have an account?', label: 'Sign in', to: '/login' }}
      stat={stats}
      title="Join the accessibility workflow."
    >
      <div className="mb-8 space-y-3 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
          <span className="material-symbols-outlined material-filled text-3xl">person_add</span>
        </div>
        <h2 className="text-3xl font-bold text-ink">Create account</h2>
        <p className="text-sm leading-6 text-muted">Start with a free workspace.</p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm font-medium text-danger" role="alert">
          {error}
        </div>
      )}

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <Input
          autoComplete="name"
          id="signup-name"
          label="Full name"
          name="full_name"
          placeholder="Alex Rivera"
          type="text"
          value={formData.full_name}
          onChange={handleChange}
        />
        <Input
          autoComplete="email"
          id="signup-email"
          label="Email address"
          name="email"
          placeholder="alex@signbridge.io"
          required
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          autoComplete="new-password"
          hint="Use at least 8 characters."
          id="signup-password"
          label="Password"
          name="password"
          placeholder="Create a password"
          required
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creating account...' : 'Create account'}
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
          <span className="material-symbols-outlined mr-2 text-xl">account_circle</span>
          Apple
        </Button>
      </div>
    </AuthLayout>
  );
}
