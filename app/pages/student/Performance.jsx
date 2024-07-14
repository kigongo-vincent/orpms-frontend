import React, { useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { BarChart, LineChart } from '@mui/x-charts'
import { Card,Box,Button, Container, Typography, List, ListItem, Avatar, ListItemText, colors, Skeleton } from '@mui/material'
import { FaEye } from 'react-icons/fa'
import UserProfile from '../../components/UserProfile'

const Performance = () => {
  const [loading, setLoading] = useState(false)
  
  const uData = [3, 10, 20, 5, 12];
const xLabels = [
  'John',
  'brian',
  'peter',
  'Fik',
  'Darias',
];
  return (
    <>
    <UserNavigation isLoggedIn={true}/>
   <Container sx={{mt:15}} maxWidth={'lg'}>
   {
    loading
    ?
    <>
    <Skeleton sx={{height: "50vh"}}/>
    <Skeleton sx={{height: "10vh", mt: 2}}/>
    </>
    :
    <Box display = "flex" alignItems="stretch">
    <Card elevation={0} sx={{p:4}}>
    <Typography variant="h6">
      You are currently a member of Group C
    </Typography>
    <Button endIcon={<FaEye/>} variant='contained' color="secondary" sx={{mt:2}}>
      View group
    </Button>
    <Typography sx={{mt:4}}>Group members</Typography>
    <List>
      {
        Array(4).fill().map((_, i)=>(
          <UserProfile user_id="1" />
        ))
      }
    </List>
    </Card>
    <Card elevation={0} sx={{ml:2}} className="d-flex align-items-center flex-column justify-content-center">
      <Typography sx={{mt:4, px:3}} color="primary" variant="h6">Demographics for group participation</Typography>
<LineChart
      width={500}
      height={300}
      series={[{ data: uData, label: 'Number of messages sent in the group', area: true, showMark: true }]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      colors={[colors.grey[400]]}
      sx={{
        '.MuiLineElement-root': {
          display: 'none',
        },
      }}
    />
    </Card>
   </Box>
   }
   </Container>
    </>
  )
}

export default Performance