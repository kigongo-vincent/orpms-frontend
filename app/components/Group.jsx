import { Error, VerifiedUser} from '@material-ui/icons'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import React from 'react'
import { FaClock, FaEye, FaShekelSign, FaShieldAlt } from 'react-icons/fa'
import UserProfile from '../components/UserProfile'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { getRelativeTime } from '../utilities/getRelativeTime'
import { useSelector } from 'react-redux'
import { getAuthInformation } from '../../src/model/slices/AuthReducer'
const Group = ({group}) => {
  const navigate = useNavigate()
  const auth = useSelector(getAuthInformation)
  return (
    <Grid item lg={4} md ={6} xs={12} sx={{p:1}}>
        <Paper elevation={0} sx={{px: 4, py:3}}>
            <Box display="flex" alignItems="center" sx={{mb:2}} justifyContent="space-between">
            <Typography>{group.name}</Typography>
            {
              group.delayed
              ?
              <Error className = "rounded p-1 bg-danger text-light"/>
              :
                group.status == "approved"
                ?
                <VerifiedUser  className="bg-success text-light p-1 rounded" />
                : 
                <FaShekelSign size={20} className = "rounded text-light bg-warning p-1"/>
            }
            </Box>
            <Typography variant="h6"  fontWeight={"bold"}>{group.project}</Typography>
            <Typography className="text-secondary my-5" variant="caption">Created by</Typography>
            <div className="shadow-md px-4 py-1 my-2">
            <UserProfile user_id={group.leader}/>
            </div>
            <Box display="flex" sx={{my:2}} alignItems={"center"}>
              <FaClock className='text-secondary' style={{marginRight: 4}}/>
            <Typography className="text-secondary">created {getRelativeTime(group.date)}</Typography>
            </Box>
           {
            auth?.userType == "lecturer" &&  <Button variant='outlined' color='info' onClick={()=>navigate(`/group/${group.id}`)}  startIcon={<FaEye />}>View group</Button>
           }
        </Paper>
    </Grid>
  )
}

export default Group