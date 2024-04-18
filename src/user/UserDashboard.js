import { Box } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';

const UserDashboard = () => {

    const { user } = useSelector(state => state.userProfile);

    return (
        <> 
            <div className='my-5'>
                <div className='bg-slate-400 p-5'><h1 className=' text-white font-bold text-2xl text-center '>Dashboard</h1></div>                 
            </div>
            <div className='flex justify-center'><p className='text-red-600 text-xl'>Complete Name :</p><p className='text-green-800 text-xl '>{user && user.name}</p></div>
                <div className='flex justify-center'><p className='text-red-600 text-xl'>E-mail :</p><p className='text-green-800 text-xl '>{user && user.email}</p></div>
                <div className='flex justify-center'><p className='text-red-600 text-xl'>Role :</p><p className='text-green-800 text-xl '>{user && user.role}</p></div>
        </>
    )
}

export default UserDashboard