import React from 'react'
import BlockIcon from '@mui/icons-material/Block';
const NotFound = () => {
    return (
        <>
<div>
      <div class="centered">
        <div><div className='text-center text-8xl pb-3 text-red-600 font-serif'>404 OOPS!<hr/></div>
        <p className='text-center'><BlockIcon/> Something Went Wrong</p>
  <div className='text-blue-800 text-2xl font-serif  text-center'>
    Page Not Found
  </div>
  <div className='text-center p-1 '><a href='/' className='border bg-slate-100'>Back to Home</a></div>
  </div>
</div>

    </div></>
    )
}

export default NotFound