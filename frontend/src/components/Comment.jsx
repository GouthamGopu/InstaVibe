import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { FaUser } from 'react-icons/fa'

const Comment = ({ comment }) => {
    return (
        <div className='my-2'>
            <div className='flex gap-3 items-center'>
                <Avatar>
                    <AvatarImage src={comment?.author?.profilePicture} />
                    <AvatarFallback><FaUser size={25} color="gray" /></AvatarFallback>
                </Avatar>
                <h1 className='font-bold text-sm'>{comment?.author.username} <span className='font-normal pl-1'>{comment?.text}</span></h1>
            </div>
        </div>
    )
}

export default Comment