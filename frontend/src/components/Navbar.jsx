import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-panel" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            margin: '1rem',
            padding: '0.8rem 2rem'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2 className="text-gradient" style={{ margin: 0 }}>Papago Sign</h2>
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
                    <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</a>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Dashboard</Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--error)',
                                    color: 'var(--error)',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '10px' }}>Login</Link>
                            <Link to="/signup">
                                <button className="primary-btn">Get Started</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
