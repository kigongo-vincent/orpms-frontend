import React, { useEffect, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { Avatar, Box, Card, CardContent, Paper, Button, Container, Fab, TextField, Link, Rating, Tooltip, Typography, colors, Skeleton, CircularProgress, Alert, Grid } from '@mui/material'
import { ArrowRight, CloudDownload, EmojiNatureSharp, GitHub, Send, Home, ArrowDownward, ArrowUpward } from '@material-ui/icons'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import UserProfile from '../../components/UserProfile'
import { useDispatch, useSelector } from 'react-redux'
import { addExternalNotifications, addNotifications, getAuthInformation, savePath } from '../../../src/model/slices/AuthReducer'
import { getRelativeTime } from '../../utilities/getRelativeTime'
const Project = () => {
    const user = useSelector(getAuthInformation)
    let { id } = useParams()
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [project, setProject] = useState(null)
    const [sending, setSending] = useState(false)
    const [members, setMembers] = useState([])
    const [viewLess, setViewLess] = useState(true)
    const [body, setBody] = useState("")
    const navigate = useNavigate()
    const [rating, setRating] = useState(0)
    const [supervisor, setSupervisor] = useState("")
    const getGroup = async () => {
        setLoading(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/group/${id}`)
        const data = await response.json()
        setMembers(data.members)
        setSupervisor(data.supervisor)
        setLoading(false)
    }

    const location = useLocation()
    const dispatch = useDispatch()


    const loginFirst = () => {
        dispatch(savePath(location.pathname))
        navigate("/login")
    }

    const addViewer = async () => {
        if (user.isLoggedIn && project) {
            const isMember = project.viewers.some(member => member == user.user_id)
            if (!isMember) {
                await fetch(`https://kigongovincent.pythonanywhere.com/view/${user.user_id}/${project.id}`)
            }
        }
    }

    useEffect(() => {
        addViewer()
    }, [project, id])

    const getProject = async () => {
        setLoading(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/project/${id}`)
        if (response.status == 200) {
            const data = await response.json()
            if (data.approved && data.status == "approved") {
                setProject(data)
            }
            const response2 = await fetch(`https://kigongovincent.pythonanywhere.com/comments/${id}`)
            const data2 = await response2.json()
            setComments(data2)
            setLoading(false)
        }
        else {
            setLoading(false)
        }
    }

    const addComment = async () => {
        setSending(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/comments/${id}`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                body: body,
                rating: rating,
                author: user.user_id,
                project: parseInt(id)
            })
        })
        if (response.status == 201) {
            const response2 = await fetch(`https://kigongovincent.pythonanywhere.com/comments/${id}`)
            const data2 = await response2.json()
            const response3 = await fetch(`https://kigongovincent.pythonanywhere.com/group_info/${project.group}`)
            if (response3.status == 200) {
                const data3 = await response3.json()
                data3.members.forEach(member => {
                    if (member != user.user_id) {

                        dispatch(addExternalNotifications({
                            message: `${user.username} just added comment to your project (${project.title}), "${body}"`,
                            severity: "info",
                            reciever: member
                        }))
                    }
                });
            }
            setComments(data2)
            setBody("")
            setRating(0)
        }
        else {

            setSending(false)
            return
        }
        setSending(false)
    }


    useEffect(() => {
        getProject()
        dispatch(savePath(location.pathname))
        getGroup()
    }, [id])

    function getAverage() {
        let sum = 0
        let average = 0
        for (let i = 0; i < comments.length; i++) {
            sum += (+comments[i].rating)
        }
        if (sum != 0) {
            average = sum / comments.length
        }
        return Math.round(average)
    }
    const [p_rating, setP_rating] = useState(0)
    useEffect(() => {
        if (comments.length != 0) {

            setP_rating(getAverage())
        }
    }, [comments, loading])
    return (

        <>
            <UserNavigation />
            {
                loading
                    ?
                    <Container sx={{ mt: 10 }}>
                        <Skeleton sx={{ height: 300 }} />
                        <Skeleton sx={{ height: 100 }} />
                    </Container>
                    :
                    !user.isLoggedIn
                        ?
                        <Navigate to={"/"} />
                        :
                        !project
                            ?
                            <Container sx={{ mt: 15 }}>
                                <Paper elevation={0} sx={{ p: 5 }}>
                                    <Typography variant='h4'>
                                        Project is not available
                                    </Typography>
                                    <Typography sx={{ mt: 1 }}>it may be under development, soon to be released</Typography>
                                </Paper>
                            </Container>
                            :
                            <>
                                <Box sx={{ backgroundColor: "rgb(240,240,245)" }}>
                                    <Container maxWidth="lg" sx={{ pt: 15, pb: 7.5 }}>
                                        <Typography variant="h4" fontWeight="900">{project?.title}</Typography>
                                        <Rating sx={{ my: 3 }} value={p_rating} precision={0.5} readOnly /> <br />
                                        {
                                            project.viewers && <Box display="flex" alignItems="center">
                                                {
                                                    project.viewers.some(member => member == user.user_id)
                                                        ?
                                                        <Typography > You {project.viewers.length == 2 ? 'and 1 more view' : project.viewers.length == 1 ? 'viewed this project' : `and ${project.viewers.length - 1} more people viewed this project`}
                                                        </Typography>
                                                        :
                                                        <Typography >{project.viewers.length} {project.viewers.length == 1 ? 'view' : 'views'}
                                                        </Typography>
                                                }
                                            </Box>
                                        }
                                        <br /><br />
                                        <Typography variant='caption' className=" mt-4 mb-3" sx={{ lineHeight: 1.8, letterSpacing: 3 }}>ABOUT</Typography>
                                        <br /><br />
                                        <div className="blur shadow-kawa p-5">
                                            {
                                                viewLess
                                                    ?
                                                    <Typography lineHeight={1.8} textAlign={"justify"} sx={{ mb: 2 }}>{project.abstract.substring(0, 580)}</Typography>
                                                    :
                                                    <Typography lineHeight={1.8} textAlign={"justify"} sx={{ mb: 2 }}>{project.abstract}</Typography>
                                            }
                                            {
                                                project.abstract.length > 580
                                                    ?
                                                    viewLess
                                                        ?
                                                        <Button onClick={() => setViewLess(false)} variant='outlined' color='error' endIcon={<ArrowDownward />}>
                                                            view more
                                                        </Button>
                                                        :
                                                        <Button onClick={() => setViewLess(true)} color='error' variant='outlined' endIcon={<ArrowUpward />}>
                                                            view less
                                                        </Button>
                                                    :
                                                    ""
                                            }
                                        </div>

                                        <Box sx={{ mt: 3 }} display="flex" alignItems="center" flexWrap={"wrap"}>
                                            {
                                                project.github_link && <>
                                                    <Tooltip title="get access to the code for the system" >
                                                        <Box className=" py-2 rounded bg-white px-4 w-xs-100">
                                                            <GitHub />
                                                            &nbsp;
                                                            <Link sx={{ mt: 3, textDecoration: "none" }}>{project.github_link}</Link>
                                                        </Box>
                                                    </Tooltip>

                                                    &nbsp;
                                                </>
                                            }
                                            {
                                                project.preview_link && <>
                                                    <Tooltip title="live demo of the app" className='mx-0 mx-sm-1 my-2 my-sm-2 '>
                                                        <Link sx={{ mt: 3, textDecoration: "none" }} >
                                                            <Box className="py-2 rounded bg-white px-4 w-xs-100 d-flex align-items-center justify-content-center">
                                                                <EmojiNatureSharp />
                                                                &nbsp;
                                                                <Typography>{project.preview_link}</Typography>


                                                            </Box>
                                                        </Link>
                                                    </Tooltip>
                                                </>
                                            }


                                        </Box>
                                    </Container>
                                </Box>
                                <Container maxWidth="lg">

                                    <Box alignItems={"center"} display={"flex"} flexDirection={"column"} className=" my-5 rounded py-4">
                                        <Typography variant={"caption"} letterSpacing={2} textAlign={"center"} textTransform={"uppercase"} sx={{ my: 5 }}>screenshots</Typography>
                                        <div className="image-group p-5 shadow-kawa">
                                            <div className="image-group-item">
                                                <img src={`https://kigongovincent.pythonanywhere.com${project.image0}`} alt="" />
                                            </div>
                                            <div className="image-group-item">
                                                <img src={`https://kigongovincent.pythonanywhere.com${project.image1}`} alt="" />
                                            </div>
                                            <div className="image-group-item">
                                                <img src={`https://kigongovincent.pythonanywhere.com${project.image2}`} alt="" />

                                            </div>
                                            <div className="image-group-item">
                                                <img src={`https://kigongovincent.pythonanywhere.com${project.image3}`} alt="" />

                                            </div>
                                        </div>



                                    </Box>

                                    <div className="shadow-md p-5">
                                        <Typography variant='caption' className="text-secondary mb-3 mt-5" sx={{ letterSpacing: 2 }}>AUTHORS</Typography>
                                        <br />
                                        <Box display={"flex"} flexWrap="wrap" alignItems="center">
                                            {
                                                members &&
                                                members.map(author => (

                                                    <Card elevation={0} className='w-xs-100' sx={{ mt: 1, mr: 1 }}>

                                                        <UserProfile user_id={author} />

                                                    </Card>


                                                ))
                                            }
                                        </Box>
                                        <br /><br />
                                        <Typography variant='caption' className="text-secondary mb-3 mt-5" sx={{ letterSpacing: 2 }}>SUPERVISED BY</Typography>
                                        <br /><br />
                                        <Card elevation={0} className="py-4 px-2 w-xs-100">
                                            <UserProfile user_id={supervisor} />
                                        </Card>
                                    </div>

                                </Container>

                                <Box className=" py-5">



                                    <Box sx={{ mt: 5 }}>
                                        <Container maxWidth={"lg"}>
                                            <Typography sx={{ mb: 3 }} fontWeight="bold" >What other people are saying</Typography>

                                            <Box display="flex" flexWrap={'wrap'}>
                                                {
                                                    comments.length == 0 ?
                                                        <Typography>No comments made yet</Typography>
                                                        :
                                                        <Grid container >
                                                            {
                                                                comments.map((comment, index) => (
                                                                    <Grid item lg={4} md={6} sm={6} xs={12} >
                                                                        <Card elevation={0} sx={{ mt: 1, mr: 1, height: "95%" }}>
                                                                            <CardContent>
                                                                                <Box>
                                                                                    <UserProfile user_id={comment.author} />
                                                                                    <Typography sx={{ ml: 9, mb: 2 }} color="primary" className="d-flex align-items-center text-secondary" fontSize={10}>
                                                                                        {getRelativeTime(comment.date)}
                                                                                    </Typography>
                                                                                </Box>
                                                                                <Box sx={{ ml: 8, mb: 2 }}>
                                                                                    <div className="container">
                                                                                        <Typography variant="subtitle1">
                                                                                            {comment.body}
                                                                                        </Typography>
                                                                                    </div>
                                                                                </Box>
                                                                                <Rating sx={{ ml: 9 }} size='small' defaultValue={comment.rating} readOnly precision={0.5} />
                                                                            </CardContent>
                                                                        </Card>
                                                                    </Grid>
                                                                ))
                                                            }
                                                        </Grid>
                                                }
                                            </Box>
                                            <Paper elevation={0} sx={{ p: 4, mt: 3 }}>
                                                <Typography sx={{ mt: 3 }}>Comments section</Typography>
                                                <TextField disabled={!user.isLoggedIn} value={body} onChange={(e) => setBody(e.target.value)} className='w-100' variant="standard" label="comment" />
                                                <p className='mt-4'>
                                                    <Rating onChange={(_, value) => setRating(value)} value={rating} defaultValue={rating} size="large" />
                                                </p>
                                                <Button disabled={!user.isLoggedIn} className='text-light' onClick={addComment} variant="contained" color="secondary" endIcon={<Send />}>
                                                    {
                                                        sending ? <CircularProgress className="text-light" size={15} /> : <span>
                                                            Send your thoughts
                                                        </span>

                                                    }
                                                </Button>
                                                {
                                                    !user.isLoggedIn &&
                                                    <Alert severity='info' className='mt-3'>
                                                        <Typography>
                                                            Login required,
                                                        </Typography> <Button onClick={loginFirst} sx={{ mt: 2 }} endIcon={<ArrowRight />} color="info">
                                                            Proceed to login
                                                        </Button>
                                                    </Alert>
                                                }
                                            </Paper>
                                        </Container>
                                    </Box>
                                </Box>
                            </>
            }
            <Fab onClick={() => navigate("/")} color='secondary' className='text-light' sx={{ position: 'fixed', bottom: 30, right: 30 }}>
                <Home />
            </Fab>
        </>
    )
}

export default Project