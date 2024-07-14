import React, { useEffect, useState } from 'react'
import { ListItem, Avatar, ListItemText, Badge, Box, Typography, Skeleton } from '@mui/material'
import { VerifiedUser, } from '@material-ui/icons'
import { useSelector } from 'react-redux'
import { getAuthInformation } from '../../src/model/slices/AuthReducer'
const UserProfile = ({ user_id, name_only }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const savedUser = useSelector(getAuthInformation)

  const getUser = async () => {
    setLoading(true)
    const response = await fetch(`https://kigongovincent.pythonanywhere.com/user/${user_id}`)
    const data = await response.json()
    if (response.status == 200) {
      setUser(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    getUser()
  }, [user_id])
  return (
    <ListItem>
      {
        loading || !user
          ?
          <Box display={"flex"} alignItems={"center"} >
            <Skeleton variant="circular" sx={{ height: 30, width: 30 }} />
            <Skeleton sx={{ width: 100, ml: 4 }} />
          </Box>
          :
          name_only
            ?
            <ListItemText>
              <Typography fontWeight={900} variant='h4'>
                {user.email.split('@')[0].split('.')[0] + " " + user.email.split('@')[0].split('.')[1]}
              </Typography>
            </ListItemText>
            : <>
              <Badge sx={{ mr: 2 }}
                overlap="circular"
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                badgeContent={user.role == "lecturer" && <VerifiedUser className="bg-danger text-light rounded p-1" />}
              >
                <Avatar src={user_id == savedUser.user_id ? savedUser.photo : `https://kigongovincent.pythonanywhere.com${user.photo}`} />
              </Badge>
              <ListItemText>
                {user_id == savedUser.user_id ? "you" : user.email.split('@')[0].split('.')[0] + " " + user.email.split('@')[0].split('.')[1]}
              </ListItemText>
            </>
      }
    </ListItem>
  )
}

export default UserProfile