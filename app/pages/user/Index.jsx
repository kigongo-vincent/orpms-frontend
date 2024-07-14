import { Info, Instagram, LinkedIn, Menu, YouTube } from '@material-ui/icons'
import { AppBar, Button, Box, Toolbar,Grid, Typography, Container, Skeleton,List, ListItem , LinearProgress, Paper, ListItemButton, Stack } from '@mui/material'

import React, { useEffect, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { useDispatch, useSelector } from 'react-redux'
import { getAllSupervisors, getAllTopics, getAllYears, getSupervisorsAndYears, getTopics, isLoading } from '../../../src/model/slices/ProjectsReducer'
import { useNavigate } from 'react-router-dom'
import UserProfile from '../../components/UserProfile'
import { FaInstagram, FaTwitch } from 'react-icons/fa'

const Index = () => {
  const navigate = useNavigate()
  const topics = useSelector(getAllTopics)
  const supervisors = useSelector(getAllSupervisors)
  const years = useSelector(getAllYears)
  const dispatch = useDispatch()
  const loading = useSelector(isLoading)
  useEffect(() => {
    dispatch(getTopics())
    dispatch(getSupervisorsAndYears())
  }, [])
  return (
    <Box height={"100vh"} display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
      <UserNavigation />
      <Container sx={{ mb: 20, mt: 12 }} >
        {
          loading
            ?
            <>
              <Skeleton sx={{ height: "60vh" }} />
              <Skeleton sx={{ height: "10vh" }} />
            </>
            :
            <>
              <Typography sx={{ px: 2, mb: 1 }}>
                Discover projects from students of Makerere University
              </Typography>
              <Button startIcon={<Info />} href='#about' className='text-light' color='secondary' variant='contained' sx={{ mx: 2, mt: 1, mb: 4 }}>

                Learn more about the system
              </Button>
              <Grid container justifyContent='space-between'>
                {/* search by topic */}
                <Grid item lg={4} xs={12}>

                  
                  

                  <Paper className='mb-lg-0 mb-4' elevation={0} sx={{ px: 1, py: 1, height: "50vh", overflow: "scroll" }}>
                    <List>
                      <Typography fontWeight={"bold"} sx={{ p: 2 }}>
                        Browse by topic
                      </Typography>
                      {
                        topics.length == 0
                        ?
                        <Typography sx={{px:2}}>No options found</Typography>
                        :
                        topics.map(topic => (
                          <ListItemButton key={topic.id} onClick={() => navigate(`/topic/${topic.name}`)} variant="outlined" >
                            <Typography textTransform={"lowercase"}>{topic.name}</Typography>
                          </ListItemButton>
                        ))
                      }
                    </List>
                  </Paper>

                </Grid>



                {/* search by supervisor  */}
                <Grid item lg={4} xs={12}>

                

                  <Paper className='mb-lg-0 mb-4 mx-lg-3 mx-0' elevation={0} sx={{ px: 2, py: 1, height: "50vh", overflow: "scroll" }}>
                    <List>
                      <Typography fontWeight={"bold"} sx={{ p: 2 }}>
                        Browse by Supervisor(Lecturer)
                      </Typography>
                      {
                        supervisors.length == 0
                          ?
                          <Typography sx={{ px: 2 }}>No options found</Typography>
                          :
                          supervisors.map((supervisor) => (
                            <ListItemButton key={supervisor} onClick={() => navigate(`/supervisor/${supervisor}`)} variant="outlined" >
                              <UserProfile user_id={supervisor} />
                            </ListItemButton>
                          ))
                      }
                    </List>
                  </Paper>

                </Grid>
                {/* search by year */}
                <Grid item lg={4} md={4} xs={12}>

                  

                

                  <Paper  elevation={0} sx={{ px: 2, py: 1, height: "50vh", overflow: "scroll" }}>
                    <List>
                      <Typography fontWeight={"bold"} sx={{ p: 2 }}>
                        Browse by Year
                      </Typography>
                      {
                        years.length == 0
                          ?
                          <Typography sx={{ px: 2 }}>No options found</Typography>
                          :
                          years.map((year) => (
                            <ListItemButton key={year} onClick={() => navigate(`/year/${year}`)} variant="outlined" >
                              {year}
                            </ListItemButton>
                          ))
                      }
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </>
        }
      </Container>

      <div className="bg-dark text-light mt-5 p-5" id="about">
        <Container>
          <Typography sx={{ my: 3, textTransform: "uppercase" }} fontWeight="bold" variant="h6">Online Research-Project Management System</Typography>
          <Typography lineHeight={1.8} className='text-secondary' maxWidth="lg" textAlign={"justify"}>
            Step into a world of seamless collaboration and enhanced productivity with our cutting-edge Online Research-Project Management System. Designed to empower researchers and teams alike, our platform offers a comprehensive suite of features tailored to streamline every aspect of your project lifecycle. From organizing tasks and tracking progress to facilitating communication and fostering collaboration, our intuitive interface ensures that your research endeavors are not just managed, but truly optimized for success. Join us as we redefine the standards of online project management, enabling you to focus on what truly matters: driving groundbreaking discoveries and achieving your research goals.
          </Typography>
          <Typography sx={{ mt: 5 }} className='text-secondary'>
            all rights reserved <u className="text-light">makerere university</u>
          </Typography>
          <Box display={"flex"} alignItems={"center"} width={"10%"} className="justify-cont mt-3">
          <FaInstagram size={15} color='#FF4CBC'/>
            <LinkedIn className='text-primary' sx={{mr:2}}/>
            <YouTube  color="error" />
          
          </Box>
        </Container>
      </div>

    </Box>
  )
}

export default Index