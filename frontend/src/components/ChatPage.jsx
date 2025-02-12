import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { FaUser } from 'react-icons/fa';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`https://instavibe-ic2m.onrender.com/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Function to handle key press events
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && textMessage.trim() !== "") {
            sendMessageHandler(selectedUser?._id);
        }
    };

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, []);

    return (
        <div className='flex md:ml-[16%] h-[90vh] md:h-screen'>
            <section className='md:w-1/4 my-8'>
                <div className='hidden md:block'>
                    <h1 className='font-bold md:mb-4 md:px-3 text-xl text-center'>{user?.username}</h1>
                    <hr className='md:mb-4 border-gray-300' />
                </div>
                <div className='overflow-y-auto h-[80vh] w-fit'>
                    {
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            return (
                                <div
                                    key={suggestedUser._id} // Make sure to add a key prop for mapping
                                    onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                    className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'
                                >
                                    <Avatar className='w-14 h-14'>
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback><FaUser size={25} color="gray" /></AvatarFallback>
                                    </Avatar>
                                    <div className='hidden md:block'>
                                        <div className='flex flex-col'>
                                            <span className='font-medium'>{suggestedUser?.username}</span>
                                            <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                                                {isOnline ? 'online' : 'offline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </section>

            {
                selectedUser ? (
                    <section className='md:flex-1 border-l border-l-gray-300 flex flex-col h-full w-full'>
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-5'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback><FaUser size={25} color="gray" /></AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser} />
                        <div className='flex items-center p-4 border-t border-t-gray-300'>
                            <Input 
                                value={textMessage} 
                                onChange={(e) => setTextMessage(e.target.value)} 
                                onKeyPress={handleKeyPress} // Add the onKeyPress event
                                type="text" 
                                className='flex-1 mr-2 focus-visible:ring-transparent' 
                                placeholder="Messages..." 
                            />
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                        </div>
                    </section>
                ) : (
                    <div className='flex flex-col items-center justify-center md:mx-auto w-full'>
                        <MessageCircleCode className='w-32 h-32 my-4' />
                        <h1 className='font-medium'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    );
}

export default ChatPage;
