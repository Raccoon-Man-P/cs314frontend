// src/components/SearchContacts.js
import React, { useState } from 'react';
import { searchContacts } from '../services/api'; // Import the searchContacts API function

const SearchContacts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchTerm) {
            setError('Please enter a search term');
            return;
        }

        try {
            const data = await searchContacts(searchTerm);  // Pass the search term to the API
            console.log('Search results:', data); // Log the results to check the response

            // Assuming the API response is structured as { contacts: [...] }
            setResults(data.contacts || []);  // Access the contacts array in the response
            setError('');
        } catch (err) {
            setError('Failed to search for users. Please try again.');
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search users by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {/* Display results in a list below the search bar */}
            {results.length > 0 && (
                <div className="search-results">
                    <ul>
                        {results.map((user) => (
                            <li key={user._id}>
                                {user.firstName} {user.lastName} ({user.email})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Show message if no results found */}
            {results.length === 0 && searchTerm && (
                <p>No results found for "{searchTerm}"</p>
            )}
        </div>
    );
};

export default SearchContacts;
