import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getMessages } from "../services/api"; // API call for message history
import "../components/ChatWindow.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
let socket = null;

const ChatWindow = ({ selectedContact, userId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (!userId) return;

        // Disconnect any existing socket instance before creating a new one
        if (socket) {
            socket.disconnect();
        }

        // Establish a new socket connection
        socket = io(SERVER_URL, {
            transports: ["websocket"],
            query: { userId }, // Send userId to backend
        });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            socket.emit("joinRoom", userId); // Join the room with userId
        });

        socket.on("receiveMessage", (message) => {
            console.log("Message received:", message);

            setMessages((prevMessages) => {
                if (!prevMessages.some(msg => msg._id === message._id)) {
                    return [...prevMessages, message];
                }
                return prevMessages;
            });
        });



        // Cleanup function
        return () => {
            console.log("Disconnecting socket...");
            socket.off("receiveMessage");
            socket.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        if (!selectedContact || !userId) return;

        const fetchMessages = async () => {
            setLoading(true);
            setError("");
            try {
                const messagesData = await getMessages(selectedContact._id);
                setMessages(messagesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedContact, userId]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedContact) {
            setError("Please select a contact and type a message.");
            return;
        }

        const messageData = {
            sender: userId,
            recipient: selectedContact._id,
            content: newMessage,
            messageType: "text",
        };

        console.log("Sending message:", messageData);

        // Emit message via Socket.IO (server will handle broadcasting)
        socket.emit("sendMessage", messageData);

        // Clear input field (but don't add the message to state yet)
        setNewMessage("");
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
                                    <div key={index} className={`message ${msg.sender === userId || msg.sender?._id === userId ? 'sent' : 'received'}`}>
                                        <p>{msg.content}</p>
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
