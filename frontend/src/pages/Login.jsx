import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/ui/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Successful auth routes to app console automatically
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Unable to log in with provided credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={
        <>
          Welcome <span className="text-primary">Back</span>
        </>
      }
      description="Continue your journey seamlessly. Authenticate to access your saved translations, account history, and personalized linguistic workflows."
      badge="Secure Auth"
      footerLink={{
        copy: "Don't have an account?",
        to: '/signup',
        label: 'Sign up for free',
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-8 flex items-center justify-between px-2">
        <a href="#reset" className="text-sm font-medium text-muted hover:text-ink">
          Forgot your password?
        </a>
      </div>
    </AuthLayout>
  );
}
