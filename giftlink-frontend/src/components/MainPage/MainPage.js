import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Task 1: Write async fetch operation
        // Write your code below this line
        const fetchGifts = async () => {
            try {
                const url = `${urlConfig.backendUrl}/api/gifts`;
                const response = await fetch(url);
                if (!response.ok) {
                    // something went wrong
                    throw new Error(`HTTP error; ${response.status}`);
                }
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
                setError('Could not load gifts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchGifts();
    }, []);

    // Task 2: Navigate to details page
    const goToDetailsPage = (productId) => {
        // Write your code below this line
        navigate(`/app/product/${productId}`);
      };

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        // Write your code below this line
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
      };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-4">
            <header className="page-header">
                <h1>Give it a <span className="gradient-text">second life</span></h1>
                <p>Browse household items your neighbours no longer need — free for anyone who wants them.</p>
            </header>

            {loading && (
                <div className="state-message">
                    <div className="spinner" />
                    Loading gifts...
                </div>
            )}
            {!loading && error && <div className="state-message">{error}</div>}

            <div className="row g-4">
                {gifts.map((gift, index) => (
                    <div key={gift.id} className="col-sm-6 col-lg-4">
                        <div className="card product-card" style={{ animationDelay: `${index * 50}ms` }}>

                            {/* // Task 4: Display gift image or placeholder */}
                            {/* // Write your code below this line */}
                            <div className="image-placeholder">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} loading="lazy" />
                                ) : (
                                    <div className="no-image-available">No Image Available</div>
                                )}
                            </div>

                            <div className="card-body">

                                {/* // Task 5: Display gift image or placeholder */}
                                {/* // Write your code below this line */}
                                <h2 className="card-title">{gift.name}</h2>

                                <div className="chip-row">
                                    <span className={`chip ${getConditionClass(gift.condition)}`}>
                                    {gift.condition}
                                    </span>
                                    <span className="chip">{gift.category}</span>
                                </div>

                                {/* // Task 6: Display gift image or placeholder */}
                                {/* // Write your code below this line */}
                                <p className="date-added">Added {formatDate(gift.date_added)}</p>

                                <button
                                    onClick={() => goToDetailsPage(gift.id)}
                                    className="btn btn-primary btn-block"
                                    id={`view-details-${gift.id}`}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
