import React, { useEffect, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { useSelector } from 'react-redux'
import { getAllProjects } from '../../../src/model/slices/ProjectsReducer'
import { Container, Skeleton, Typography } from '@mui/material'
import ProjectCard from '../../components/ProjectCard'
import { Navigate } from 'react-router-dom'
import { getAuthInformation } from '../../../src/model/slices/AuthReducer'
const PublishedReports = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const user = useSelector(getAuthInformation)
    const getProjects = async () => {
        const res = await fetch(`https://kigongovincent.pythonanywhere.com/projects/supervisor/${user.user_id}`)
        if (res.status == 200) {
            const data = await res.json()
            setProjects(data.filter(project => project.status == "approved"))
            setLoading(false)
        }
        else {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProjects()
    }, [])
    return (
        <>
            {
                !user.isLoggedIn || user.userType != "lecturer"
                    ?
                    <Navigate to={'/'} />
                    :
                    <div>
                        <UserNavigation />
                        <Container sx={{ mt: 15 }}>
                            {
                                loading
                                    ?
                                    <>
                                        <Skeleton height={"50vh"} />
                                        <Skeleton height={"10vh"} />
                                    </>
                                    :
                                    <>
                                        <Typography sx={{ mb: 5 }}>Projects you approved &nbsp; ({projects.length})</Typography>
                                        {
                                            projects.map(project => (
                                                <ProjectCard project={project} key={project.id} />
                                            ))
                                        }
                                    </>
                            }
                        </Container>

                    </div>
            }
        </>
    )
}

export default PublishedReports