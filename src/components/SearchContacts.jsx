import React, { useState } from 'react';
import { searchContacts } from '../services/api'; // Import the searchContacts API function
import { getAllContacts } from '../services/api'; // Import the new API call for all contacts
import './SearchContacts.css';

const SearchContacts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [isAllContacts, setIsAllContacts] = useState(false); // Track if all contacts are displayed

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchTerm) {
            setError('Please enter a search term');
            return;
        }

        try {
            const data = await searchContacts(searchTerm);  // Pass the search term to the API
            console.log('Search results:', data); // Log the results to check the response

            setResults(data.contacts || []);  // Access the contacts array in the response
            setError('');
            setIsAllContacts(false); // Set to false when search results are shown
        } catch (err) {
            setError('Failed to search for users. Please try again.');
        }
    };

    const handleGetAllContacts = async () => {
        try {
            const data = await getAllContacts();  // Call the API to get all contacts
            console.log('All contacts:', data); // Log the results to check the response

            setResults(data.contacts || []);  // Update the results with all contacts
            setError('');
            setIsAllContacts(true); // Set to true when displaying all contacts
        } catch (err) {
            setError('Failed to load all contacts. Please try again.');
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

            <button onClick={handleGetAllContacts}>Get All Contacts</button>

            {error && <p className="error-message">{error}</p>}

            {/* Display results in a list below the search bar */}
            {results.length > 0 && (
                <div className="search-results">
                    <ul>
                        {results.map((user) => (
                            <li key={user._id || user.value}> {/* Use _id or value as the key */}
                                {isAllContacts ? ( // If displaying all contacts, show the label
                                    user.label
                                ) : ( // Otherwise, show detailed info for search results
                                    <>
                                        {user.firstName} {user.lastName} ({user.email})
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Show message if no results found */}
            {results.length === 0 && searchTerm && !isAllContacts && (
                <p>No results found for "{searchTerm}"</p>
            )}
        </div>
    );
};

export default SearchContacts;
