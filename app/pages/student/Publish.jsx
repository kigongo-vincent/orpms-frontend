import React, { useEffect, useLayoutEffect, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { Container, TextField, Typography, Box, Alert, IconButton, Paper, Button, CircularProgress, Skeleton, InputLabel } from '@mui/material'
import { Camera, Close } from '@material-ui/icons'
import { FaUpload } from 'react-icons/fa'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addExternalNotifications, addNotifications, getAuthInformation } from '../../../src/model/slices/AuthReducer'


const Publish = () => {
    const navigate = useNavigate()
    const [visible, setVisible] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [loading, setLoading] = useState(true)
    const [github, setGithub] = useState("")
    const [preview, setPreview] = useState("")
    const { id } = useParams()
    const [project, setProject] = useState(null)
    const [code, setCode] = useState(200)
    const [images, setImages] = useState([])

    const user = useSelector(getAuthInformation)

    const dispatch = useDispatch()

    const publishReport = async () => {
        setUpdating(true)
        const formData = new FormData()
        github.length != 0 && formData.append("github_link", github)
        preview.length != 0 && formData.append("preview_link", preview)
        if (images.length != 0) {
            for (let i = 0; i < 4; i++) {
                if (images[i]) {
                    formData.append(`image${i}`, images[i])
                }
            }
        }
        formData.append("approved", true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/update_project/${id}`, {
            method: "PATCH",
            body: formData
        })
        if (response.status == 201) {
            navigate(-1)
            dispatch(addNotifications({
                reciever: user.user_id,
                severity: "success",
                message: "You have successfully published your project, " + "(" + project.title + ")" + ", making it visible to all people on the platform"
            }))
            if (JSON.parse(localStorage.getItem("data"))) {
                JSON.parse(localStorage.getItem("data")).members.forEach(member => {
                    if (member != user.user_id) {
                        dispatch(addExternalNotifications({
                            reciever: member,
                            severity: "success",
                            message: `${user.username} successfully published your project, (${project.title}), making it visible to all people on the platform`
                        }))
                    }
                })
            }
            setUpdating(false)
        } else {
            setCode(400)
            setUpdating(false)
        }
        setUpdating(false)
    }

    const getProject = async () => {
        setLoading(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/project/${id}`)
        if (response.status == 200) {
            const data = await response.json()
            setProject(data)
            setLoading(false)
        }
        else {
            setLoading(false)
        }

    }
    useLayoutEffect(() => {
        getProject()
    }, [])





    const HiddenInput = () => {
        return <input type="file" accept='.jpg, .png, .jpeg' multiple onChange={(e) => setImages(e.currentTarget.files)} className='d-none' />
    }
    return (
        <>
            {
                loading
                    ?
                    <>
                        <Box height={"100vh"} className="bg-light" width={"100vw"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <Paper sx={{ p: 10 }} elevation={0} className='d-flex align-items-center justify-content-center'>
                                <CircularProgress color={"secondary"} sx={{ mr: 3 }} />
                                <Typography>Please stand by as we fetch resources</Typography>
                            </Paper>
                        </Box>
                    </>
                    :
                    !user.isLoggedIn || project.approved
                        ?
                        <Navigate to={`/project/${project.id}`} />
                        :
                        <>
                            <UserNavigation />
                            <Container sx={{ mt: 11 }} maxWidth="md">
                                <Typography fontWeight="bold">Publish Report</Typography>
                                <hr />
                                {
                                    visible && <Alert severity='warning' action={<IconButton onClick={() => setVisible(false)}>
                                        <Close />
                                    </IconButton>}>
                                        You are about to upload the report making it visible to everyone
                                    </Alert>
                                }
                                <Paper elevation={0} sx={{ p: 4, mb: 1, mt: 2 }}>
                                    <TextField label="Github link (optional)" value={github} onChange={(e) => setGithub(e.target.value)} type="text" className='w-100 my-3' variant='standard' />
                                    <TextField label="preview link (optional)" value={preview} onChange={(e) => setPreview(e.target.value)} type="text" className='w-100 my-3' variant='standard' helperText="enable people get a preview of the application" />
                                    {
                                        images.length == 0
                                            ?
                                            <Box className="shadow-md px-4 py-3 mt-2">
                                                <Typography variant="caption">Please select screenshots appendible to your projects</Typography>
                                                <br /><br />
                                                <Button startIcon={<Camera />} variant='outlined'>
                                                    <InputLabel>
                                                        add photos (must be 4)
                                                        <HiddenInput />
                                                    </InputLabel>
                                                </Button>
                                            </Box>
                                            :
                                            <Alert severity='info' action={<IconButton onClick={() => setImages([])}>
                                                <Close />
                                            </IconButton>}>
                                                {
                                                    images.length < 4
                                                        ?
                                                        <Typography>you have selected a total of {(images.length)} image(s) but for you to proceed you need to have a total of 4 images close this message and select more images</Typography>
                                                        : images.length == 4
                                                            ?
                                                            <Typography>you have selected a total of 4 images</Typography>
                                                            :
                                                            <Typography>you have selected a total of {(images.length)} images {images.length > 4 && 'but only 4 will be uploaded please confirm before proceeding.'}</Typography>
                                                }
                                            </Alert>
                                    }
                                </Paper>
                                <Box>
                                    <Button onClick={() => navigate(-1)} color="secondary" variant="contained" startIcon={<Close />}>
                                        cancel
                                    </Button>
                                    <Button disabled={images.length != 4} onClick={publishReport} sx={{ ml: 1 }} color="primary" variant="contained" startIcon={!updating && <FaUpload size={15} />}>
                                        {
                                            updating
                                                ?
                                                <span className='opacity-50'>
                                                    <CircularProgress size={13} className="text-light" />
                                                    &nbsp;
                                                    getting things ready...
                                                </span>
                                                :
                                                "publish project"
                                        }
                                    </Button>
                                    {
                                        code != 200 && <Alert sx={{ mt: 1 }} severity='error' action={<IconButton onClick={() => setCode(200)}><Close /></IconButton>}>
                                            something went wrong
                                        </Alert>
                                    }
                                </Box>

                            </Container>
                        </>
            }
        </>
    )
}

export default Publish