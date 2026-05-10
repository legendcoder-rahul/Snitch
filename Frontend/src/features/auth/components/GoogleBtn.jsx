import React from 'react'
import googleIcon from '../../../assets/google.png'

const GoogleBtn = () => {
  return (
    <>
        <button type='button' className="flex items-center justify-center w-full px-4 py-4 text-sm font-medium text-white bg-[#101010] rounded hover:bg-[#1a1a1a] transition-colors cursor-pointer">
        <a href="/api/auth/google" className="flex items-center gap-2">
        <img className='h-6 w-6' src={googleIcon} alt="" />
        Sign in with Google
        </a>
        </button>
    </>
  )
}

export default GoogleBtn