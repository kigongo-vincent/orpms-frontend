import React, { useEffect, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { Container, Grid, Skeleton, Typography } from '@mui/material'
import Group from '../../components/Group'
import { useSelector } from 'react-redux'
import { getAuthInformation } from '../../../src/model/slices/AuthReducer'
import { Navigate } from 'react-router-dom'

const Groups = () => {
  const user = useSelector(getAuthInformation)
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState([])
  // const groups=[
  //   // {
  //   //   id: 1,
  //   //   name: "Group 5",
  //   //   project: "E-commerce App",
  //   //   author: "Kigongo Vincent",
  //   //   status: "approved"
  //   // }
  // ]

  const getGroups = async () => {
    setLoading(true)
    const response = await fetch(`https://kigongovincent.pythonanywhere.com/groups/${user.user_id}`)
    if (response.status == 200) {
      const data = await response.json()
      setGroups(data)
      setLoading(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    getGroups()
  }, [])
  return (
    <>
      {
        !user.isLoggedIn && user.userType != "lecturer"
          ?
          <Navigate to="/" />
          :
          <div>
            <UserNavigation />
            <Container sx={{ mt: 13 }}>
              {
                loading
                  ?
                  <>
                    <Skeleton height={"50vh"} />
                    <Skeleton height={"10vh"} />
                  </>
                  :
                  <>
                    <Typography sx={{ mb: 1, px: 2 }} className="text-secondary">Groups under your supervision</Typography>
                    <Grid container>
                      {
                        groups.length == 0
                          ?
                          <Typography variant="h4" fontWeight={"bold"}>No groups found</Typography>
                          :
                          groups.map(group => (
                            <Group group={group} id={group.id} />
                          ))
                      }
                    </Grid>
                  </>
              }
            </Container>

          </div>
      }
    </>
  )
}

export default Groups