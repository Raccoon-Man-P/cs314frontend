import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getMessages, deleteDM } from "../services/api";
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

        if (socket) {
            socket.disconnect();
        }

        socket = io(SERVER_URL, {
            transports: ["websocket"],
            query: { userId }, 
        });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            socket.emit("joinRoom", userId); 
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

        socket.emit("sendMessage", messageData);

        setNewMessage("");
    };

    const deleteMessage = async (messageId) => {
        console.log("Deleting message with ID:", messageId);
        try {
            await deleteDM(messageId);
            setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageId));
        } catch (err) {
            setError("Failed to delete message.");
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
                                    <div
                                        key={index}
                                        className={`message ${msg.sender._id === userId ? 'sent' : 'received'}`}
                                    >
                                        <p>{msg.content}</p>
                                        {msg.sender._id === userId && (
                                            <button onClick={() => deleteMessage(msg._id)}>Delete</button>
                                        )}
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
