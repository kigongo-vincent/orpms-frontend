import React, { useEffect, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { LabelImportant, Home } from '@material-ui/icons'

import { Box, Container, Grid, Paper, Typography, List, Fab, ListItemButton, ListItemText, Tooltip, CircularProgress, Skeleton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProjects, getAllSupervisors, getAllTopics, getAllYears, getProjects, getSupervisorsAndYears, getTopics, loading_projects } from '../../../src/model/slices/ProjectsReducer'
import Pagination from '../../components/Pagination'
import ProjectCard from '../../components/ProjectCard'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { savePath } from '../../../src/model/slices/AuthReducer'
import UserProfile from '../../components/UserProfile'
import { getName } from '../../utilities/getName'

const Topic = () => {

    const { id, category } = useParams()

    const navigate = useNavigate()

    const projects = useSelector(getAllProjects)
    const years = useSelector(getAllYears)
    const supervisors = useSelector(getAllSupervisors)
    const fetching = useSelector(loading_projects)


    const dispatch = useDispatch()

    const [currentPage, setCurrentPage] = useState(1);

    const location = useLocation()



    const [loading, setLoading] = useState(true)


    const [this_user, set_this_user] = useState({ id: 0, photo: "" })


    const numberOfProjects = projects ? projects.length : 0
    const projectsPerPage = 2; // Display one project per page

    const getUser = async () => {
        setLoading(true)
        const res = await fetch(`https://kigongovincent.pythonanywhere.com/user/${id}`)
        if (res.status == 200) {
            const data = await res.json()
            set_this_user(data)
        }
        setLoading(false)
    }


    // Get current projects
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    useEffect(() => {
        setLoading(false)
        dispatch(getTopics())
        dispatch(getProjects(location.pathname))
        dispatch(getSupervisorsAndYears())
        dispatch(savePath(location.pathname))
        if (category == "supervisor") {
            getUser()
        }
    }, [id])
    const topics = useSelector(getAllTopics)
    return (
        <Box sx={{ height: '100vh' }}>
            <UserNavigation />




            <Container sx={{ mt: 14 }}>
                {
                    category == "supervisor"
                        ?
                        loading
                            ?
                            <>
                                <Skeleton sx={{ height: "24vh" }} />
                            </>
                            :
                            <Paper elevation={0} sx={{ p: 3 }}>
                                <Typography sx={{ mb: 2 }} variant='h4' fontWeight={900}>
                                    {getName(this_user.email)}
                                </Typography>
                                {this_user.email}
                            </Paper>
                        :
                        <Typography color="primary" variant="h3" fontWeight="900" sx={{ textTransform: "capitalize" }}>{id}</Typography>
                }
                <Typography sx={{ p: category == "supervisor" ? 2 : 0 }} variant="subtitle1">{numberOfProjects} {numberOfProjects == 1 ? 'project' : 'projects'}</Typography> <br />
            </Container>

            <Box sx={{ mt: 3, backgroundColor: "rgb(255,255,255)" }}>
                <Container maxWidth={"lg"} className="d-flex align-items-center px-4" sx={{ py: 3 }}>
                    <LabelImportant className="text-secondary mx-2" />
                    {
                        category == "topic"
                            ?
                            <Typography>Discover recent projects in {id}</Typography>
                            :
                            category == "year"
                                ?
                                <Typography>Discover recent projects in the year {id}</Typography>
                                :
                                <Typography>Discover recent projects conducted under the supervision of {getName(this_user.email)}</Typography>
                    }
                </Container>
            </Box>

            <Container sx={{ mt: 3 }}>
                <Grid container>
                    <Grid item lg={8} xs={12}>
                        {
                            fetching ?
                                <>
                                    <Skeleton sx={{ height: "200px" }} />
                                    <Skeleton sx={{ width: "50%" }} />
                                </>
                                :
                                numberOfProjects == 0
                                    ?
                                    <Typography>
                                        No projects found
                                    </Typography>
                                    :
                                    currentProjects.map(project => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))
                        }
                    </Grid>
                    <Grid item lg={4} xs={12}>
                        {
                            fetching ?
                                <>
                                    {/* <CircularProgress sx={{ml: 5}}/> */}
                                </>
                                :
                                <Paper elevation={0} className='mx-lg-4 my-lg-0 my-4 mx-0' >
                                    <Typography color={"error"} sx={{ pl: 2, pt: 3 }}>
                                        Other {category == "topic" ? "topic(s)" : category == "year" ? "Year(s)" : "supervisor(s)"}
                                    </Typography>
                                    {
                                        category == "topic"
                                            ?
                                            <List>
                                                {
                                                    topics &&
                                                    topics.map(topic => (
                                                        topic.name != id && (
                                                            <Tooltip key={topic.id} title={`view projects under ${topic.name}`} arrow>
                                                                <ListItemButton onClick={() => navigate(`/topic/${topic.name}`)}>
                                                                    <ListItemText>
                                                                        {topic.name}
                                                                    </ListItemText>
                                                                </ListItemButton>
                                                            </Tooltip>
                                                        )
                                                    ))
                                                }
                                            </List>
                                            :
                                            category == "year"
                                                ?
                                                <List>
                                                    {
                                                        years.length > 0
                                                            ?
                                                            years.map(year => (
                                                                year != id && (
                                                                    <Tooltip key={year} title={`view projects published in ${year}`} arrow>
                                                                        <ListItemButton onClick={() => navigate(`/year/${year}`)}>
                                                                            <ListItemText>
                                                                                {year}
                                                                            </ListItemText>
                                                                        </ListItemButton>
                                                                    </Tooltip>
                                                                )
                                                            ))
                                                            :
                                                            <Typography>
                                                                No options found
                                                            </Typography>
                                                    }
                                                </List>
                                                :
                                                <List>
                                                    {
                                                        supervisors &&
                                                        supervisors.map(supervisor => (
                                                            supervisor != id && (
                                                                <Tooltip key={supervisor} title={`view projects conducted under ${supervisor}`} arrow>
                                                                    <ListItemButton onClick={() => navigate(`/supervisor/${supervisor}`)}>
                                                                        <UserProfile user_id={supervisor} />
                                                                    </ListItemButton>
                                                                </Tooltip>
                                                            )
                                                        ))
                                                    }
                                                </List>
                                    }
                                </Paper>
                        }

                    </Grid>
                </Grid>

                {
                    fetching ? <Skeleton className="w-50" /> :
                        projects.length > 2 && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} projects={projects} projectsPerPage={projectsPerPage} />
                }
            </Container>



            <Fab onClick={() => navigate("/")} color='secondary' className='text-light' sx={{ position: 'fixed', bottom: 30, right: 30 }}>
                <Home />
            </Fab>
        </Box>
    )
}

export default Topic