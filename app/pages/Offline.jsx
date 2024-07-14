import { Paper } from '@mui/material'
import React from 'react'

const Offline = () => {
  return (
    <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center bg-light">
        <Paper elevation={0} sx={{p:5}}>
            404 <span className='opacity-50'>|</span> page not found
        </Paper>
    </div>
  )
}

export default Offline