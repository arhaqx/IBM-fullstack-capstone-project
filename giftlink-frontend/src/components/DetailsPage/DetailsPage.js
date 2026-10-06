import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

	useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
			// Task 1: Check for authentication and redirect
            navigate('/app/login');
            return;
        }

        // get the gift to be rendered on the details page
        const fetchGift = async () => {
            try {
				// Task 2: Fetch gift details
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();

		// Task 3: Scroll to top on component mount
		window.scrollTo(0, 0);

    }, [productId, navigate]);


    const handleBackClick = () => {
		// Task 4: Handle back click
		navigate(-1);
	};

	//The comments have been hardcoded for this project.
    const comments = [
        {
            author: "John Doe",
            comment: "I would like this!"
        },
        {
            author: "Jane Smith",
            comment: "Just DMed you."
        },
        {
            author: "Alice Johnson",
            comment: "I will take it if it's still available."
        },
        {
            author: "Mike Brown",
            comment: "This is a good one!"
        },
        {
            author: "Sarah Wilson",
            comment: "My family can use one. DM me if it is still available. Thank you!"
        }
    ];

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (loading) return <div className="state-message"><div className="spinner" />Loading...</div>;
    if (error) return <div className="state-message">Error: {error}</div>;
    if (!gift) return <div className="state-message">Gift not found</div>;

return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-4" id="details-back" onClick={handleBackClick}>&larr; Back</button>
            <div className="card product-details-card">
                <div className="row g-0">
                    <div className="col-lg-6">
                        <div className="image-placeholder-large">
                            {gift.image ? (
                                // Task 5: Display gift image
                                <img src={gift.image} alt={gift.name} className="product-image-large" />
                            ) : (
                                <div className="no-image-available-large">No Image Available</div>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card-header text-white">
                            <h1 className="details-title">{gift.name}</h1>
                        </div>
                        <div className="card-body details-body">
                            {/* Task 6: Display gift details */}
                            <p><strong>Category:</strong>
                                {gift.category}
                            </p>
                            <p><strong>Condition:</strong>
                                {gift.condition}
                            </p>
                            <p><strong>Date Added:</strong>
                                {formatDate(gift.date_added)}
                            </p>
                            <p><strong>Age (Years):</strong>
                                {gift.age_years}
                            </p>
                            <p><strong>Description:</strong>
                                {gift.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="comments-section mt-4">
                <h2 className="mb-3">Comments</h2>
                {/* Task 7: Render comments section by using the map function to go through all the comments */}
                {comments.map((comment, index) => (
                    <div key={index} className="card mb-3 comment-card">
                        <div className="card-body">
                            <p className="comment-author"><strong>{comment.author}:</strong></p>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DetailsPage;
