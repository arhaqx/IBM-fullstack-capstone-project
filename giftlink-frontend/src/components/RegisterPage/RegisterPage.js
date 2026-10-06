import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
    // Task 4: Create state variables for all the inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();

    // Task 6: Create handleRegister function
    const handleRegister = async (e) => {
        e.preventDefault();
        setShowerr('');
        setSubmitting(true);
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                // Task 6: Set method
                method: 'POST',
                // Task 7: Set headers
                headers: {
                    'content-type': 'application/json',
                },
                // Task 8: Set body to send user details
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                }),
            });

            // Step 2: Task 1 - Access data coming from fetch API
            const json = await response.json();

            if (json.authtoken) {
                // Step 2: Task 2 - Set user details in session storage
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);
                // Step 2: Task 3 - Set the state of user to logged in using the useAppContext
                setIsLoggedIn(true);
                setUserName(firstName);
                // Step 2: Task 4 - Navigate to the MainPage after logging in
                navigate('/app');
            } else if (json.error) {
                // Step 2: Task 5 - Set an error message if the registration fails
                setShowerr(json.error);
            } else if (json.errors) {
                setShowerr(json.errors.map((err) => err.msg).join('. '));
            } else {
                setShowerr('Registration failed. Please try again.');
            }
        } catch (e) {
            console.log('Error fetching details: ' + e.message);
            setShowerr('Unable to reach the server. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card register-card">
                <h1>Create account</h1>
                <p className="subtitle">Join GiftLink and start sharing things you no longer need.</p>

                <form onSubmit={handleRegister} noValidate>
                    {/* Task 5: Include all the input elements */}
                    <div className="row g-3">
                        <div className="col-6">
                            <label htmlFor="firstName" className="form-label">First name</label>
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Jane"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="lastName" className="form-label">Last name</label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mt-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-error" role="alert">{showerr}</div>

                    {/* Task 6: Include a button that performs the `handleRegister` function when clicked */}
                    <button type="submit" className="btn btn-primary btn-block" id="register-submit" disabled={submitting}>
                        {submitting ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="switch-link">
                    Already a member? <Link to="/app/login" id="go-to-login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
