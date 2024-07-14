import React from 'react'
import { Card, Button, CardContent, Avatar, AvatarGroup, Typography, Box } from '@mui/material'
import { ViewAgenda, CloudDownload } from '@material-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAuthInformation } from '../../src/model/slices/AuthReducer'
const ProjectCard = ({ project, setOpen }) => {
    const navigate = useNavigate()
    const user = useSelector(getAuthInformation)
    const addViewer = async () => {
        if (user.isLoggedIn) {
            const isMember = project.viewers.some(member => member == user.user_id)
            if (!isMember) {
                await fetch(`https://kigongovincent.pythonanywhere.com/view/${user.user_id}/${project.id}`)
                navigate(`/project/${project.id}`)

            }
            else {
                navigate(`/project/${project.id}`)
            }
        }
        else {
            setOpen && setOpen(false)
            const login = confirm("To view this project you must be logged in, Are you sure you want to login?")
            if (login) {
                setOpen && setOpen(false)
                navigate('/login')
            }
        }
    }
    return (
        <Card sx={{ mb: 5 }} elevation={0}>
            <CardContent>
                <Typography variant="h5">{project.title}</Typography>
                <Typography textAlign={"justify"} className="mt-3" variant="subtitle1" lineHeight={1.8}>{project.abstract.substring(0, 380)}...</Typography>
                <Box sx={{ mt: 5 }} flexWrap={'wrap'} display="flex" alignItems="center">
                    <Button onClick={addViewer} variant="outlined" color="secondary" className='mx-0 my-3' startIcon={<ViewAgenda />}>View project</Button> &nbsp;
                    {
                        project.viewers && <Box display="flex" sx={{ ml: 1 }} alignItems="center">
                            {
                                project.viewers.some(member => member == user.user_id)
                                    ?
                                    <Typography> You {project.viewers.length == 2 ? 'and 1 more view' : project.viewers.length == 1 ? 'viewed this project' : `and ${project.viewers.length - 1} more people viewed this project`}
                                    </Typography>
                                    :
                                    <Typography>{project.viewers.length} {project.viewers.length == 1 ? 'view' : 'views'}
                                    </Typography>
                            }
                        </Box>
                    }
                </Box>
            </CardContent>
        </Card>
    )
}

export default ProjectCard