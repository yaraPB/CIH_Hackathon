import React from 'react'
import Link from "next/link"

const Navbar = () => {
  return (
    <div>
        <ul className='flex bg-green-900 text-white p-2 gap-3'>
            <li className='hover:cursor-pointer'>
                <Link href="/">Home</Link>
            </li>
            <li className='hover:cursor-pointer'>
                <Link href="/about">About</Link>
            </li>
            <li className='hover:cursor-pointer'>
                <Link href="/posts">Posts</Link>
            </li>
        </ul>
    </div>
  )
}

export default Navbar