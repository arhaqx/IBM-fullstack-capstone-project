import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    // Task 4: Create useState hook variables for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('auth-token');
    const { setIsLoggedIn, setUserName } = useAppContext();

    // If the user is already logged in, send them to the main page
    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);

    // Task 6: Create handleLogin function
    const handleLogin = async (e) => {
        e.preventDefault();
        setIncorrect('');
        setSubmitting(true);
        try {
            // Step 1: Task 1 - Implement the API call
            const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                // Step 1: Task 2 - Set method
                method: 'POST',
                // Step 1: Task 3 - Set headers
                headers: {
                    'content-type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
                },
                // Step 1: Task 4 - Set body to send user details
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            // Step 2: Task 1 - Access data in JSON format as output from the API
            const json = await res.json();

            if (json.authtoken) {
                // Step 2: Task 2 - Set user details in session storage
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);
                // Step 2: Task 3 - Set the user's state to logged in using the useAppContext
                setIsLoggedIn(true);
                setUserName(json.userName);
                // Step 2: Task 4 - Navigate to the MainPage after logging in
                navigate('/app');
            } else {
                // Step 2: Task 5 - Clear input and set an error message if the password is incorrect
                setPassword('');
                setIncorrect(json.error === 'User not found'
                    ? 'No account found for this email.'
                    : 'Wrong password. Try again.');
                // Step 2: Task 6 - Hide the error message after 2 seconds
                setTimeout(() => {
                    setIncorrect('');
                }, 2000);
            }
        } catch (e) {
            console.log('Error fetching details: ' + e.message);
            setIncorrect('Unable to reach the server. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card login-card">
                <h1>Welcome back</h1>
                <p className="subtitle">Log in to claim gifts and manage your profile.</p>

                <form onSubmit={handleLogin} noValidate>
                    {/* Task 5: Include all the input elements */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setIncorrect(''); }}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setIncorrect(''); }}
                            required
                        />
                    </div>

                    <div className="form-error" role="alert">{incorrect}</div>

                    {/* Task 6: Include a button that performs the `handleLogin` function when clicked */}
                    <button type="submit" className="btn btn-primary btn-block" id="login-submit" disabled={submitting}>
                        {submitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="switch-link">
                    New here? <Link to="/app/register" id="go-to-register">Create an account</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
