import React, { useEffect, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { Container, Grid, Skeleton, Typography } from '@mui/material'
import Group from '../../components/Group'
import { useSelector } from 'react-redux'
import { getAuthInformation } from '../../../src/model/slices/AuthReducer'
import { Navigate, useParams } from 'react-router-dom'

const Groups = () => {
  const { id } = useParams()
  const user = useSelector(getAuthInformation)
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState([])

  const getGroups = async () => {
    setLoading(true)
    const response = await fetch(`https://kigongovincent.pythonanywhere.com/groups/${id}`)
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
        user?.userType != "cordinator"
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
                    <Typography sx={{ mb: 1, px: 2 }} className="text-secondary">Groups supervised</Typography>
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