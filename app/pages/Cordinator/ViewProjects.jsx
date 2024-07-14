import React, { useLayoutEffect, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { Box, Button, Container, Skeleton, Typography } from '@mui/material'
import { FaCheck, FaCheckDouble, FaSpinner } from 'react-icons/fa'

const ViewProjects = () => {

  const [loading, setLoading] = useState(true)

  const [projects, setProjects] = useState([])

  const GET = async () => {
    try {
      const response = await fetch(`https://kigongovincent.pythonanywhere.com/all_projects`)

      const data = await response.json()

      setProjects(data)

    }

    catch (err) {

      alert("failed to get projects")

    }

    finally {
      setLoading(false)
    }



  }

  useLayoutEffect(() => {

    GET()

  }, [])
  return (
    <div>

      <UserNavigation />

      <Container sx={{ mt: 11 }}>

        {

          loading

            ?

            <>

              <Skeleton height={"10vh"} />
              <Skeleton height={"50vh"} />
            </>

            :

            <>
              {

                projects.length == 0

                  ?

                  <Typography>No projects found</Typography>

                  :

                  <Box>

                    <div className="d-flex align-items-center justify-content-between">

                      <Typography variant='h5' fontWeight={600}>Projects</Typography>

                      <Box height={20} width={30} borderRadius={100} className="bg-danger text-light d-flex align-items-center justify-content-center">
                        <span>{projects?.length}</span>
                      </Box>

                    </div>

                    <table className='bg-white mt-4 p-5 rounded shadow-md w-100'>

                      <tr className='bg-greener'>
                        <td className='py-3 px-5'><b>Group name</b></td>
                        <td><b>Project title</b></td>
                        <td><b>Status</b></td>
                        <td><b>Course</b></td>
                      </tr>

                      {
                        projects?.map(project => (

                          <tr key={project?.name}>

                            <td className='py-3 px-5'>{project?.group_name}</td>
                            <td>{project?.title}</td>
                            <td>


                              {

                                project.status == "approved"

                                  ?

                                  <Button sx={{ borderRadius: 100 }} color='secondary' variant='outlined' startIcon={<FaCheck size={12} />}>
                                    <Typography textTransform={"lowercase"}>Approved</Typography>
                                  </Button>

                                  :

                                  <Button sx={{ borderRadius: 100 }} color='warning' variant='outlined' startIcon={<FaSpinner size={12} />}>
                                    <Typography textTransform={"lowercase"}>Ongoing</Typography>
                                  </Button>

                              }


                            </td>
                            <td>{project?.course_name}</td>

                          </tr>

                        ))
                      }

                    </table>

                  </Box>

              }
            </>

        }
      </Container>

    </div>
  )
}

export default ViewProjects