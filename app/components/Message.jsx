import React from 'react'
import UserProfile from './UserProfile'
import { Box, Button, Typography, colors } from '@mui/material'
import { FaEye } from 'react-icons/fa'
import dayjs from 'dayjs'
import { getRelativeTime } from '../utilities/getRelativeTime'
import { useSelector } from 'react-redux'
import { getAuthInformation } from '../../src/model/slices/AuthReducer'
const Message = ({ msg }) => {
  const user = useSelector(getAuthInformation)
  return (
    <Box sx={{ pb: 3, px: 2 }}>
      <UserProfile user_id={msg.author} />
      <Typography sx={{ ml: 9, pb: 2 }} className="text-secondary">sent {getRelativeTime(msg.date)}</Typography>
      <Box bgcolor={user.user_id == msg.author ? "rgb(247, 247, 250)" : "#d9f8e0"} className={`rounded w-40`}>

        {
          msg.file &&
          <>
            <div className='d-flex w-100 mb-2 align-items-center rounded justify-cotent-center' style={{ objectFit: "cover", overflow: "hidden" }}>
              <img className='w-100' src={`https://kigongovincent.pythonanywhere.com${msg.file}`} />

            </div>

          </>
        }
        <Typography sx={{ px: 2, py: 2 }}>
          {msg.body}
        </Typography>
        {
          msg.file &&
          <div className="d-flex align-items-center justify-content-center">
            <Button target="_blank" className='px-4 text-secondary mb-4' href={`https://kigongovincent.pythonanywhere.com${msg.file}`} sx={{ mt: 2, mx: 2 }} startIcon={<FaEye size={15} />}>
              large format
            </Button>
          </div>

        }
      </Box>
    </Box>
  )
}

export default Message