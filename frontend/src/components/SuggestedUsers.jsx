import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner'; // Ensure you have this installed
import { updateFollowing } from '@/redux/authSlice'; // Update the import path if necessary

const SuggestedUsers = () => {
    const dispatch = useDispatch();
    const { user, suggestedUsers } = useSelector(store => store.auth);

    return (
        <div className='md:my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                suggestedUsers.map((suggestedUser) => {
                    const isFollowing = user.following.includes(suggestedUser?._id);

                    const followOrUnfollow = async (userId) => {
                        try {
                            const res = await axios.post(`https://instavibe-ic2m.onrender.com/api/v1/user/followorunfollow/${userId}`, {}, { withCredentials: true });
                            if (res.data.success) {
                                toast.success(res.data.message);
                                dispatch(updateFollowing({ userId, isFollowing: !isFollowing }));
                            } else {
                                toast.error('Failed to follow/unfollow user');
                            }
                        } catch (error) {
                            console.error('Error following/unfollowing user:', error);
                            toast.error('Error occurred. Please try again.');
                        }
                    };

                    return (
                        <div key={suggestedUser._id} className='flex items-center justify-between md:my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${suggestedUser?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={suggestedUser?.profilePicture} alt={suggestedUser?.username} />
                                        <AvatarFallback><FaUser size={25} color="gray" /></AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${suggestedUser?._id}`}>{suggestedUser?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{suggestedUser?.bio || ''}</span>
                                </div>
                            </div>

                            <span
                                className={`text-xs font-bold cursor-pointer ${isFollowing ? 'text-[#ED4956] hover:text-[#bf444e]' : 'text-[#3BADF8] hover:text-[#3495d6]'}`}
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent navigation when clicking follow/unfollow
                                    followOrUnfollow(suggestedUser?._id);
                                }}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </span>

                        </div>
                    );
                })
            }
        </div>
    );
}

export default SuggestedUsers;
