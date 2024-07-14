import React, { useEffect, useRef, useState } from 'react'
import { AppBar, Typography, Button, Box, Toolbar, TextField, InputAdornment, Backdrop, Paper, Avatar, IconButton, Skeleton,  Badge, Dialog, colors, Popover, Alert, CircularProgress, Container } from '@mui/material'
import { Close, Search, Menu, Notifications, Work } from '@material-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProjects } from '../../src/model/slices/ProjectsReducer'
import ProjectCard from './ProjectCard'
import { getRelativeTime } from '../utilities/getRelativeTime'
import { Searching, getAuthInformation, getNotifications, viewNotifications } from '../../src/model/slices/AuthReducer'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
const UserNavigation = () => {
    const [isFetching, setIsFetching] = useState(false)
    const [loading, setLoading] = useState(false)

    const [search, setSearch] = useState('')

    const [notify, setNotify] = useState(false)

    const [open, setOpen] = useState(false)

    const user = useSelector(getAuthInformation)

    const isLoggedIn = user.isLoggedIn

    const dispatch = useDispatch()

    const navigate = useNavigate()
    
    const anchorEl = useRef(null).current

    const viewNotification=()=>{
      dispatch(viewNotifications(user.user_id))
      setNotify(!notify)
    }
    useEffect(()=>{
      if(user.isLoggedIn){
        dispatch(getNotifications(user.user_id))
      }
    },[user.isLoggedIn])
    useEffect(()=>{
      if(search.length > 0){
        dispatch(Searching(search))
      }
    },[search])



  return (
    <>
    <AppBar sx={{boxShadow: '0px 2px 10px rgba(0,0,0,.05)', backgroundColor: "white"}}>
        <Toolbar className='d-flex align-items-center justify-content-between'>
          {
            isLoggedIn ? <IconButton onClick ={()=>setOpen(true)}><Menu/></IconButton>: <Typography color="primary" fontWeight={900}>ORPMS</Typography>
          }
          <TextField
          className="w-100 mx-4"
          value ={search}
          onChange={(e)=>setSearch(e.target.value)}
          onFocus={()=>setIsFetching(true)} sx={{my:1, height: '1%'}} InputProps={
            {
                endAdornment :(
                    <InputAdornment>
                    <IconButton onClick={()=>setIsFetching(true)}>
                    <Search/>
                    </IconButton>
                    </InputAdornment>
                )
            }
          }  placeholder='Search'/>
          
          <Box display="flex" alignItems="center">
            {
              isLoggedIn  ? <Box display="flex" alignItems="center"><Avatar src={user.photo}></Avatar>
                <Badge onClick ={viewNotification} ref={anchorEl} badgeContent={user.getting_notifications ? <CircularProgress className='text-light' size={10}/> : user.notifications.filter(n => n.is_viewed == false).length != 0 ? user.notifications.filter(n => n.is_viewed == false).length: user.notifications.length}  color={ user.notifications.filter(n => n.is_viewed == false).length > 0 ?'error': 'warning'} sx={{mx:2}}>
              {/* <IconButton > */}
                <Notifications className = "text-dark" sx={{scale: 2}}/>
              {/* </IconButton> */}
              </Badge>
              </Box> : <>
              <Link to ="/signup" className = "nav-link">
            <Button variant ="contained" color='error' sx={{mr:1}}>Signup</Button>
              </Link>
              <Link to ="/login"  className = "nav-link">
              <Button color="secondary" className='text-light'   variant ="contained">Login</Button>
              </Link>

              </>
            }
          </Box>
        </Toolbar>
      </AppBar>
      <Backdrop open = {isFetching} sx={{zIndex: 4}}>
          <Container>
          <Paper  sx={{ height: "60vh", overflowY: "scroll"}} className = "mt-5 px-3">
            {
                user.searching ? <>
                <Box display="flex"  alignItems = "center" justifyContent= "space-between">
                        <Typography>Results</Typography>
                        <IconButton onClick ={()=>{setIsFetching(false);}}>
                            <Close/>
                        </IconButton>
                    </Box>
                <Skeleton variant = "rectangular" sx={{mt:5}}></Skeleton>
                <Skeleton variant = "rectangular" sx={{height: '20vh'}} ></Skeleton>
                <Skeleton variant = "rectangular" className = "w-50 mt-3" ></Skeleton>
                </>:
                <Box >
                    <Box display="flex" sx={{position: "sticky", px:2, py:1 , zIndex: 4, top: 0,backdropFilter: "blur(6px)", backgroundColor: "rgba(255,255,255,.3)"}} alignItems = "center" justifyContent= "space-between">
                        <Typography>Results</Typography>
                        <IconButton onClick ={()=>setIsFetching(false)}>
                            <Close/>
                        </IconButton>
                    </Box>
                   <Box >
                   {
                        user.searchResults.filter(p => p?.status == "approved" && p?.approved).length == 0 ? <Typography variant='h5' fontWeight={"bold"} className='opacity-25 px-4'>No results found</Typography>:
                        user.searchResults.filter(p => p.status == "approved" && p.approved).map(project => 
                            <ProjectCard project={project} setOpen ={setIsFetching}/>
                        )
                    }
                   </Box>
                </Box>
            }
          </Paper>
          </Container>
      </Backdrop>

        <Sidebar open={open} user={user} setOpen={setOpen}/>

      <Popover

      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open ={notify} 
      >
        <Box sx={{p:0}} className="notification-bar">
        <Box  display ="flex"  sx={{position: "sticky", px:2, py:1 , zIndex: 4, top: 0, backgroundColor: "rgba(255,255,255,.3)", backdropFilter: "blur(6px)"}} alignItems="center" justifyContent = "space-between">
          <Typography>
            notifications
          </Typography>
          <IconButton sx={{ml:5}} onClick ={()=>setNotify(false)}>
            <Close/>
          </IconButton>
        </Box>
        
        {
          user.loading
          ?
          <>
          <Skeleton variant='rounded' sx={{height: 35, width:300}}/>
          <Skeleton variant='rounded' className='mt-2 w-25'/>
          </>

          :
          user.notificationError ?
          <Alert severity='error'>
            failed to load notifications, please reload to clear this error
          </Alert>
          :
          user.notifications.length == 0
          ?
          <p className='text-secondary p-4'>

            {"Dear " + user.username + ", You donot have any notifications"}
          </p>
          :
          user.notifications?.map(i=>(


            
              <Alert sx={{maxWidth: 400, minWidth: 300, marginBottom: 1, marginLeft: .7}} severity={i.severity}>
                <div className="container">
                <p>{i.message}</p>
                <Typography variant='caption'>{getRelativeTime(i.date)}</Typography>
                </div>
              </Alert>
            
          ))
        }
        </Box>
      </Popover>
    </>
  )
}

export default UserNavigation