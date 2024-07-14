import React, { useEffect, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import Date from '../../components/Date'
import { Autocomplete, Box, Container, Grid, Paper, Skeleton, TextField, Typography } from '@mui/material'
import Gauge from '../../components/Gauge'
import { LineChart } from '@mui/x-charts'
import { colors } from '@material-ui/core'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAuthInformation } from '../../../src/model/slices/AuthReducer'
const Index = () => {
  const user = useSelector(getAuthInformation)

  const [loading, setLoading] = useState(true)

  const [deadlines, setDeadlines] = useState(JSON.parse(localStorage.getItem("deadlines")))

  const [academicYears, setAcademicYears] = useState(JSON.parse(localStorage.getItem("deadlines")) ? JSON.parse(localStorage.getItem("deadlines")).map(deadline => deadline.academic_year) : [])

  const [deadline, setDeadline] = useState("")


  const [statistics, setStatistics] = useState({ all: 0, approved: 0, pending: 0, delayed: 0 })

  const getStatisitics = async () => {
    setLoading(true)
    const response = await fetch(`https://kigongovincent.pythonanywhere.com/my_projects/${user.user_id}`)
    if (response.status == 200) {
      const data = await response.json()
      setStatistics(data)
      setLoading(false)
    }
    else {
      setLoading(false)
    }

  }
  useEffect(() => {
    getStatisitics()
  }, [])

  return (
    <>
      {
        !user.isLoggedIn
          ?
          <Navigate to={"/"} />
          :
          <>
            <UserNavigation />
            <Container sx={{ mt: 15 }}>
              {
                loading
                  ?
                  <>
                    <Skeleton sx={{ height: "50vh" }} />
                    <Skeleton sx={{ height: "10vh" }} />
                  </>
                  :
                  <Grid container>
                    <Grid item lg={8} xs={12} className='px-0 px-lg-4'>
                      <Typography sx={{ mb: 2 }} className="text-secondary">Greeting</Typography>
                      <Paper elevation={0} sx={{ p: 5, my: 3 }}>
                        <Typography className='d-flex align-item-center flex-wrap' lineHeight={1.5} variant="h5" fontWeight={"bold"}>Welcome to your dashboard, &nbsp;
                          <Typography fontWeight={"bold"} lineHeight={1.5} variant="h5" textTransform={"uppercase"}>{user.username}</Typography>

                        </Typography>
                      </Paper>
                      <Box>
                        <Typography sx={{ mb: 2 }}>Report Analytics (This shows the statistics of report approval)</Typography>
                        <Box>
                          <Gauge delayed={statistics.delayed} approved={statistics.approved} pending={statistics.pending} total={statistics.all} />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item lg={3} xs={12} sx={{}}>
                      <Typography sx={{ mb: 1 }}>Select the academic year</Typography>
                      <Autocomplete title="" label="academic year" value={deadline?.length != 0 ? deadline?.academic_year : deadlines ? deadlines[0]?.academic_year : ''} onChange={(_, value) => setDeadline(deadlines.find(d => d.academic_year == value))} className="w-100 mb-3" variant="filled" options={academicYears} renderInput={(params) => <TextField {...params} />} />
                      <div className="" style={{ scale: .6 }}>
                        <Date date={deadline ? deadline?.deadline : deadlines ? deadlines[0]?.deadline : ''} />
                      </div>
                    </Grid>
                  </Grid>
              }

            </Container>
          </>
      }
    </>
  )
}

export default Index