import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getMessages } from '../services/api'; // We're using this to get conversation history
import '../components/ChatWindow.css';

let socket = null;
let myRole = "me"; // Default role

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const ChatWindow = ({ selectedContact, userId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newMessage, setNewMessage] = useState('');

    // Initialize socket connection when userId is available
    useEffect(() => {
        if (!userId) return;

        // Connect socket to the server
        socket = io(SERVER_URL, {
            transports: ["websocket"],
            query: { user: myRole },
        });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id, "as:", myRole);
        });

        // Listen for incoming messages from the server
        socket.on('receiveMessage', (message) => {
            // Make sure the message is for the current user or the selected contact
            if (message.receiverId === userId || message.senderId === userId) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
            console.log('Message received:', message);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [userId]);

    useEffect(() => {
        if (!selectedContact || !userId) return;

        const fetchMessages = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch conversation history between the user and selectedContact
                const messagesData = await getMessages(userId, selectedContact.id);
                setMessages(messagesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedContact, userId]);

    // Send message using socket.emit
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        // Ensure a selected contact exists
        if (!selectedContact) {
            setError("Please select a contact to send the message.");
            return;
        }

        try {
            // Create the message object
            const messageData = {
                senderId: userId, // Your userId
                receiverId: selectedContact.id, // The selected contact's ID
                text: newMessage,
                timestamp: new Date().toISOString(),
            };

            // Emit the message via Socket.IO
            socket.emit('sendMessage', messageData);

            // Optionally, add the message to the UI immediately
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage('');
        } catch (err) {
            setError(err.message);
            console.error('Error sending message:', err);
        }
    };

    return (
        <div className="chat-window">
            {selectedContact ? (
                <>
                    <div className="chat-header">
                        Chat with {selectedContact.firstName} {selectedContact.lastName}
                    </div>
                    {loading ? (
                        <p>Loading messages...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <div className="messages-container">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div key={index} className={`message ${msg.senderId === selectedContact.id ? 'received' : 'sent'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No messages yet.</p>
                            )}
                        </div>
                    )}
                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </>
            ) : (
                <p>Select a contact to start chatting.</p>
            )}
        </div>
    );
};

export default ChatWindow;
