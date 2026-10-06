import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';
import './SearchPage.css';

function SearchPage() {

    //Task 1: Define state variables for the search query, age range, and search results.
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6); // Initialize with minimum value
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`;
                console.log(url);
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`);
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);


    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async (e) => {
        if (e) e.preventDefault();

        // Construct the search URL based on user input
        const baseUrl = `${urlConfig.backendUrl}/api/search?`;
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: selectedCategory,
            condition: selectedCondition,
        }).toString();

        try {
            const response = await fetch(`${baseUrl}${queryParams}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
            setHasSearched(true);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setAgeRange(6);
        setSelectedCategory('');
        setSelectedCondition('');
    };

    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        // Task 6. Enable navigation to the details page of a selected gift.
        navigate(`/app/product/${productId}`);
    };




    return (
        <div className="container mt-4">
            <header className="page-header">
                <h1>Find the <span className="gradient-text">perfect gift</span></h1>
                <p>Filter by category, condition, and age — or just type what you are looking for.</p>
            </header>

            <div className="row g-4">
                <div className="col-lg-4">
                    <form className="filter-section p-4" onSubmit={handleSearch}>
                        <h5 className="mb-3">Filters</h5>
                        <div className="d-flex flex-column gap-3">
                            {/* Task 3: Dynamically generate category and condition dropdown options.*/}
                            <div>
                                <label htmlFor="categorySelect" className="form-label">Category</label>
                                <select
                                    id="categorySelect"
                                    className="form-select dropdown-filter"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="conditionSelect" className="form-label">Condition</label>
                                <select
                                    id="conditionSelect"
                                    className="form-select dropdown-filter"
                                    value={selectedCondition}
                                    onChange={(e) => setSelectedCondition(e.target.value)}
                                >
                                    <option value="">All</option>
                                    {conditions.map((condition) => (
                                        <option key={condition} value={condition}>{condition}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Task 4: Implement an age range slider and display the selected value. */}
                            <div>
                                <label htmlFor="ageRange" className="form-label d-flex justify-content-between">
                                    <span>Less than</span>
                                    <span className="age-value">{ageRange} years</span>
                                </label>
                                <input
                                    type="range"
                                    className="form-range age-range-slider"
                                    id="ageRange"
                                    min="1"
                                    max="10"
                                    value={ageRange}
                                    onChange={(e) => setAgeRange(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Task 7: Add text input field for search criteria*/}
                        <label htmlFor="searchQuery" className="form-label mt-3">Item name</label>
                        <input
                            type="text"
                            id="searchQuery"
                            className="form-control search-input mb-3"
                            placeholder="e.g. lamp, desk, sofa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        {/* Task 8: Implement search button with onClick event to trigger search:*/}
                        <button type="submit" className="btn btn-primary btn-block search-button" id="search-submit">
                            Search
                        </button>
                        <button type="button" className="btn btn-ghost btn-block mt-2" id="search-reset" onClick={resetFilters}>
                            Reset filters
                        </button>
                    </form>
                </div>

                <div className="col-lg-8">
                    {/*Task 5: Display search results and handle empty results with a message. */}
                    <p className="results-count">
                        {hasSearched ? `${searchResults.length} result(s) found` : `Showing all ${searchResults.length} gifts`}
                    </p>
                    <div className="search-results">
                        {searchResults.length > 0 ? (
                            searchResults.map((product) => (
                                <div key={product.id} className="card search-results-card mb-3">
                                    <div className="row g-0">
                                        <div className="col-sm-4">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="search-thumb" loading="lazy" />
                                            ) : (
                                                <div className="no-image-available search-thumb">No Image</div>
                                            )}
                                        </div>
                                        <div className="col-sm-8">
                                            <div className="card-body">
                                                <h5 className="card-title">{product.name}</h5>
                                                <div className="chip-row">
                                                    <span className="chip">{product.category}</span>
                                                    <span className="chip">{product.condition}</span>
                                                    <span className="chip">{product.age_years} yrs</span>
                                                </div>
                                                <p className="card-text">{product.description.slice(0, 100)}...</p>
                                                <button
                                                    onClick={() => goToDetailsPage(product.id)}
                                                    className="btn btn-primary align-self-start"
                                                    id={`search-view-${product.id}`}
                                                >
                                                    View More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert empty-results" role="alert">
                                No products found. Please revise your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
