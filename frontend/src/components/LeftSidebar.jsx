import { Heart, Home, LogOut, MessageCircle, PlusSquare } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { FaUser } from 'react-icons/fa'
import { clearNotifications } from '@/redux/rtnSlice'  // Redux action to clear notifications

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false); // Track popover open state

    const logoutHandler = async () => {
        try {
            const res = await axios.get('https://instavibe-ic2m.onrender.com/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        }
    }

    // Handle popover close event
    const handlePopoverClose = () => {
        setIsPopoverOpen(false);
        // Clear notifications when the popover is closed
        dispatch(clearNotifications());
    }

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6 text-center md:text-left '>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback className="text-center md:text-left">
                        <FaUser className="text-gray-500" size={20} md:size={25} />
                    </AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ];

    return (
        <div className='bg-white md:bg-transparent fixed md:top-0 md:left-0 bottom-0 md:px-4 md:border-r border-t md:border-t-0 border-gray-300 md:w-[16%] w-full md:h-screen h-[10%] z-10'>
            <div className='flex md:flex-col flex-row justify-around md:justify-start'>
                <h1 className='md:my-8 md:pl-3 font-bold text-xl hidden md:inline'>InstaVibe</h1>
                <div className='flex md:flex-col flex-row md:gap-0 gap-3'>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon}
                                    <span className='hidden md:inline'>{item.text}</span>
                                    {
                                        item.text === "Notifications" && likeNotification.length > 0 && (
                                            <Popover open={isPopoverOpen} onOpenChange={(open) => {
                                                setIsPopoverOpen(open);
                                                if (!open) handlePopoverClose();
                                            }}>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p>No new notifications</p>) : (
                                                                likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback><FaUser size={25} color="gray" /></AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />

        </div>
    )
}

export default LeftSidebar
