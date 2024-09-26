import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='flex-1 md:my-8 mb-20 flex flex-col items-center md:pl-[20%]'>
        <Posts/>
    </div>
  )
}

export default Feed