import React, { useState } from 'react';
import { searchContacts, getAllContacts } from '../services/api'; 
import './SearchContacts.css';

const SearchContacts = ({ onSelectContact }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [isAllContacts, setIsAllContacts] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchTerm) {
            setError('Please enter a search term');
            return;
        }

        try {
            const data = await searchContacts(searchTerm);  
            console.log('Search results:', data);

            setResults(data.contacts || []);
            setError('');
            setIsAllContacts(false); 
        } catch (err) {
            setError('Failed to search for users. Please try again.');
        }
    };

    const handleGetAllContacts = async () => {
        try {
            const data = await getAllContacts(); 
            console.log('All contacts:', data);

            setResults(data.contacts || []); 
            setError('');
            setIsAllContacts(true); 
        } catch (err) {
            setError('Failed to load all contacts. Please try again.');
        }
    };

    const handleSelectContact = (contact) => {
        onSelectContact(contact); 
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

            {results.length > 0 && (
                <div className="search-results">
                    <ul>
                        {results.map((user) => (
                            <li
                                key={user._id || user.value} 
                                onClick={() => handleSelectContact(user)} 
                            >
                                {isAllContacts ? user.label : `${user.firstName} ${user.lastName} (${user.email})`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {results.length === 0 && searchTerm && !isAllContacts && (
                <p>No results found for "{searchTerm}"</p>
            )}
        </div>
    );
};

export default SearchContacts;
