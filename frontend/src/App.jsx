import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const History = lazy(() => import('./pages/History'));
const TextToSign = lazy(() => import('./pages/TextToSign'));
const Settings = lazy(() => import('./pages/Settings'));
const Support = lazy(() => import('./pages/Support'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const LiveRecognition = lazy(() => import('./pages/LiveRecognition'));
const LearnPage = lazy(() => import('./pages/LearnPage'));

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/translator" element={<LiveRecognition />} />
              <Route path="/history" element={<History />} />
              <Route path="/text-to-sign" element={<TextToSign />} />
              <Route path="/support" element={<Support />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
