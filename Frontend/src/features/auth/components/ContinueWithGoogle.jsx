import React from 'react'
import googleIcon from '../../../assets/google.png'

const ContinueWithGoogle = () => {
  return (
    <>
        <button type='button' className="flex items-center justify-center w-full px-4 py-4 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100 transition-colors cursor-pointer">
        <a href="/api/auth/google" className="flex items-center gap-2">
        <img className='h-6 w-6' src={googleIcon} alt="" />
        Sign in with Google
        </a>
        </button>
    </>
  )
}

export default ContinueWithGoogle