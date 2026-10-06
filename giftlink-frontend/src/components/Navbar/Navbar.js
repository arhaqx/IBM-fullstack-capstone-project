import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        setUserName('');
        setMenuOpen(false);
        navigate('/app');
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar navbar-expand-lg gl-navbar" id="main-navbar">
            <a className="navbar-brand" href="/home.html" id="nav-brand">
                <img src="/static/presents.svg" alt="" aria-hidden="true" />
                <span className="gradient-text">GiftLink</span>
            </a>

            <button
                className="navbar-toggler"
                type="button"
                id="nav-toggler"
                aria-controls="navbarNav"
                aria-expanded={menuOpen}
                aria-label="Toggle navigation"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
                <ul className="navbar-nav me-auto ms-lg-4">
                    {/* Task 1: Add links to Home and Gifts below*/}
                    <li className="nav-item">
                        <a className="nav-link" href="/home.html" id="nav-home">Home</a>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/app" end id="nav-gifts" onClick={closeMenu}>Gifts</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/app/search" id="nav-search" onClick={closeMenu}>Search</NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav align-items-lg-center gap-2">
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-user" to="/app/profile" id="nav-profile" onClick={closeMenu}>
                                    <span className="avatar">{(userName || '?').charAt(0).toUpperCase()}</span>
                                    {userName}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link logout-btn" id="nav-logout" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/app/login" id="nav-login" onClick={closeMenu}>Login</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link login-btn" to="/app/register" id="nav-register" onClick={closeMenu}>Register</NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
