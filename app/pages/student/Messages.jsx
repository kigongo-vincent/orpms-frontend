import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { Box, Button, Card, Container, TextField, Grid, IconButton, InputAdornment, List, Typography, Paper, Backdrop, Popover, Skeleton, CircularProgress, InputLabel, Alert, Dialog, DialogContent, Autocomplete } from '@mui/material'
import UserProfile from '../../components/UserProfile'
import { Info, LeakRemove, Send, FileCopy, Close, CloudUpload, Edit, Publish, ArrowBack, ArrowRight, Grade, ArrowRightRounded, Delete } from '@material-ui/icons'
import Message from '../../components/Message'
import { FaBackward, FaCamera, FaChartBar, FaCheckSquare, FaDownload, FaEye, FaFileWord, FaPen, FaTrash, FaUserPlus } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { getGroup } from '../../../src/model/slices/GroupReducer'
import { addExternalNotifications, addNotifications, format, getAuthInformation } from '../../../src/model/slices/AuthReducer'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import dayjs from 'dayjs'
import Doc from '../../components/Doc'

import { getName } from '../../utilities/getName'

import { getDaysRemaining } from '../../utilities/getDeadline'
import { getRelativeTime } from '../../utilities/getRelativeTime'


const Messages = () => {

    const scroll = useRef(null)

    const { id } = useParams()

    const user = useSelector(getAuthInformation)

    const [loading, setLoading] = useState(true)

    const [messages, setMessages] = useState([])

    const [approving, setApproving] = useState(false)

    const [failed, setFailed] = useState(false)

    const [file, setFile] = useState(null)

    const [students, setStudents] = useState([])

    const [new_student, setNew_student] = useState("")

    const getStudentId = (name) => {
        const s = students.find(student => getName(student.email) == name)
        return s ? s.id : 0
    }



    const getStudents = async () => {
        const response = await fetch("https://kigongovincent.pythonanywhere.com/students")
        if (response.status == 200) {
            const data = await response.json()
            setStudents(data)
        }
    }

    const [sending, setSending] = useState(false)

    const [project, setProject] = useState({ id: null, abstract: null, report: null })

    const [message, setMessage] = useState("")

    const [getting, setGetting] = useState(false)

    const [group, setGroup] = useState({ members: [], id: 0, name: "", supervisor: 0 })

    const [difference, setDifference] = useState(null);



    const getProject = async () => {
        setGetting(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/get_project/${group.id}`)
        if (response.status == 200) {
            const data = await response.json()
            setProject(data)
            setGetting(false)
        } else {
            setGetting(false)
        }
    }

    const dispatch = useDispatch()

    const sendMessage = async () => {
        setSending(true)
        const formData = new FormData()
        let group_id = JSON.parse(localStorage.getItem("data")).id
        file && formData.append("file", file)
        formData.append("author", user.user_id)
        formData.append("body", message)
        formData.append("group", group_id)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/messages/${group_id}`, {
            method: "POST",
            body: formData
        })
        const data = await response.json()
        setMessages(data)
        setMessage("")
        if (group) {
            user.user_id != group.supervisor &&
                dispatch(addExternalNotifications({
                    reciever: group.supervisor,
                    message: `${user.username} just sent a message to a group under your supervision (${group.name}), "${message}". Join the conversation by saying something in the group`,
                    severity: "info"
                }))
            group.members.forEach(member => {
                if (member != user.user_id) {
                    dispatch(addExternalNotifications(
                        {
                            reciever: member,
                            message: `${user.username} just sent a message to a group you're in, (${group.name}), "${message}". Join the conversation by saying something in the group`,
                            severity: "info"
                        }
                    ))
                }
            })
        }
        setFile(null)
        setSending(false)
    }

    const navigate = useNavigate()
    const gotoReport = () => {
        navigate(`/report/${project.id}`)
    }




    const GET = async (setter, path, second_setter, second_path, use_response_one) => {
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/${path}`)
        if (response.status == 200) {
            const data = await response.json()
            setter(data)
            localStorage.setItem("data", JSON.stringify(data))
            if (second_path && second_setter) {
                const response2 = await fetch(`https://kigongovincent.pythonanywhere.com/${second_path}${use_response_one && data.id}`)
                if (response2.status == 200) {
                    const data2 = await response2.json()
                    second_setter(data2)
                    setLoading(false)

                }
                setLoading(false)
            }
            setLoading(false)

        }
        else {

            setLoading(false)
        }
        setLoading(false)
    }

    const [info, setInfo] = useState(false)

    const HiddenInput = () => {
        return (
            <input className="d-none" accept='.jpg, .png, .jpeg' type="file" onChange={(e) => setFile(e.currentTarget.files[0])} />
        )
    }
    useEffect(() => {

        GET(setGroup, user.userType == "lecturer" ? `group_info/${id}` : `get_group/${id}`, setMessages, `messages/`, true)

    }, [])

    useLayoutEffect(() => {
        if (scroll.current) {
            scroll.current.scrollTop = scroll.current.scrollHeight - scroll.current.clientHeight
        }
    }, [scroll.current, messages, message])


    const [report, setReport] = useState(null)

    const [updating, setUpdating] = useState(false)

    const [reportMessage, setReportMessage] = useState(200)

    const [daysRemaining, setDaysRemaining] = useState(0)

    const [adding, setAdding] = useState(false)

    const [add, setAdd] = useState(false)


    const addMember = async () => {
        if (group.id != 0) {

            console.log("Bearer" + user?.tokens?.access)
            setAdding(true)
            const newMember = getStudentId(new_student)
            const response = await fetch(`https://kigongovincent.pythonanywhere.com/add_member/${group.id}`, {
                method: "POST",
                headers: {
                    // 'Authorization': "Bearer " + user?.tokens?.access,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    new_member: newMember
                })
            })
            if (response.status == 202) {
                setGroup({ ...group, members: [...group.members, newMember] })
                getStudents()
                setAdding(false)
                setAdd(false)
                setNew_student("")
            }
            else {
                setFailed(true)
                setAdding(false)
            }
        }

    }

    useEffect(() => {
        if (group.id != 0) {
            setDaysRemaining(getDaysRemaining(group.academic_year))
        }
    }, [group])





    const Hidden = () => {
        return (
            <input type="file" accept=".pdf" onChange={(e) => setReport(e.currentTarget.files[0])} className="d-none" />
        )
    }

    const updateReport = async () => {
        let sure = confirm("Are you sure you want to upload " + report.name)
        if (sure) {
            setUpdating(true)
            const formData = new FormData()
            formData.append("report", report)
            const response = await fetch(`https://kigongovincent.pythonanywhere.com/update_project/${project.id}`, {
                method: "PATCH",
                body: formData
            })
            if (response.status == 201) {
                const data = await response.json()
                if (group) {
                    if (user.user_id == group.supervisor) {

                    }
                    else {
                        dispatch(addExternalNotifications({
                            reciever: group.supervisor,
                            message: `${user.username} (Group leader of ${group.name}) uploaded a new copy of the project , kindly take time and check it out in the group. (${report.name})`,
                            severity: "warning"
                        }))
                    }
                    group.members.forEach(member => {
                        if (member != user.user_id) {
                            dispatch(addExternalNotifications(
                                {
                                    reciever: member,
                                    message: `${user.username} uploaded a new copy of the project, take time and check it out in the group. (${report.name})`,
                                    severity: "warning"
                                }
                            ))
                        }
                    })
                }
                setReportMessage(201)
                setProject(data)
                setReport(null)
                setUpdating(false)
            } else {
                setReportMessage(400)
                setUpdating(false)
            }
            setReport(null)
            setUpdating(false)
        }
    }
    useEffect(() => {
        if (report && project) {
            updateReport()
        }
    }, [report])

    useEffect(() => {
        if (file) {
            alert(`you have selected ${file.name}`)
        }
    }, [file])

    useEffect(() => {
        if (group.id != 0) {
            getProject()
            setDifference(getDaysRemaining(group.academic_year))
            getStudents()
        }
    }, [group])





    const approveProject = async () => {
        if (group.id != 0 && project.id != 0) {
            const approve = confirm(`Are you sure you want to approve ${group.name}`)
            if (approve) {
                setApproving(true)
                const formData = new FormData()
                formData.append("status", "approved")
                formData.append("delayed", getDaysRemaining(group.academic_year) < 0 ? "True" : "False")
                const response = await fetch(`https://kigongovincent.pythonanywhere.com/approve_project/${project.id}`, {
                    method: "PATCH",
                    body: formData,

                })
                if (response.status == 201) {
                    // navigate("/groups")
                    setProject({ ...project, status: "approved" })
                    let data = JSON.parse(localStorage.getItem("data"))
                    if (group) {
                        dispatch(addNotifications({
                            reciever: group.supervisor,
                            message: `you have approved ${group.name} and its project (${project.title}) will now be available globally to all users on the platform`,
                            severity: "success"
                        }))
                        group.members.forEach(member => {
                            dispatch(addExternalNotifications(
                                {
                                    reciever: member,
                                    message: `Congragulations! Your supervisor (${user.username}) has approved your group (${group.name})`,
                                    severity: "success"
                                }
                            ))

                        })
                    }
                    data.status = "approved"

                    localStorage.setItem("data", JSON.stringify(data))
                    setApproving(false)

                }
                else {
                    setApproving(false)
                }
            }

        }
    }

    const [currentMember, setCurrentMember] = useState(null)



    const removeMember = async () => {

        if (group.id != 0) {
            setGroup({ ...group, members: group.members.filter(m => +m != +currentMember) })
            setStudents(students.filter(student => student != currentMember))
            setMessages(messages.filter(message => message?.author != currentMember))
            const response = await fetch(`https://kigongovincent.pythonanywhere.com/remove_member/${group.id}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    // "Authorization": `Bearer ${user?.tokens?.access}`
                },
                body: JSON.stringify({ member: currentMember })

            })

            if (response.status == 202) {
                setCurrentMember(null)
            }
        }
    }

    useEffect(() => {
        if (currentMember) {
            const sure = confirm("Are you sure you want to remove this member from the group")
            if (sure) {
                removeMember()
            }
        }
    }, [currentMember])
    return (
        <>
            {
                !user.isLoggedIn
                    ?
                    <Navigate to={'/'} />
                    :
                    user?.userType == "student" || user?.userType == "lecturer"
                        ?

                        <>

                            <UserNavigation isLoggedIn={true} />
                            <Container maxWidth="lg" sx={{ mt: 12 }} >

                                {
                                    loading
                                        ?
                                        <>
                                            <Skeleton sx={{ height: "60vh" }} />
                                            <Skeleton sx={{ height: "10vh" }} />
                                        </>
                                        :
                                        <Grid container spacing={2} >
                                            <Grid item lg={3} xs={12}>

                                                <Card elevation={0} sx={{ height: "80vh", overflowY: "scroll", p: 4 }}>
                                                    <Typography variant={"h5"} fontWeight={"900"}>{group && group.name}</Typography>
                                                    <Typography sx={{ mt: 2 }}>Group participants</Typography>
                                                    <hr />
                                                    <List sx={{ mt: 3 }}>

                                                        {
                                                            group.members.length == 0
                                                                ?
                                                                <Typography>
                                                                    No members found
                                                                </Typography>

                                                                :
                                                                group.members.map(member => (
                                                                    <Box display="flex" alignItems="center">
                                                                        <UserProfile user_id={member} />
                                                                        {
                                                                            user?.userType == "lecturer" && group?.status == "pending"
                                                                                ?
                                                                                group?.leader != member
                                                                                && <IconButton onClick={() => { setCurrentMember(member) }}>
                                                                                    <Delete color='error' />
                                                                                </IconButton>
                                                                                :
                                                                                ""
                                                                        }
                                                                    </Box>
                                                                ))
                                                        }
                                                    </List>
                                                    <UserProfile user_id={group.supervisor} />

                                                </Card>
                                            </Grid>

                                            <Grid item lg={9} xs={12}>

                                                <Card elevation={0} sx={{ height: "80vh", py: 4, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                    <>
                                                        <Box sx={{ px: 4, pb: 2 }} display="flex" alignItems="center" justifyContent={'space-between'}>
                                                            {
                                                                user.userType == "lecturer" && group?.status == "pending"
                                                                    ?
                                                                    <IconButton title='add user' onClick={() => setAdd(true)}>
                                                                        <FaUserPlus size={17} />
                                                                    </IconButton>
                                                                    :
                                                                    <Button className='d-none d-lg-flex' onClick={() => navigate("/")} startIcon={<ArrowBack size={14} />}>
                                                                        back to home
                                                                    </Button>
                                                            }
                                                            {
                                                                reportMessage != 200 &&
                                                                <Alert className='shadow-sm' sx={{ position: "fixed", top: "20%", left: "40%", zIndex: 400 }} action={
                                                                    <IconButton onClick={() => setReportMessage(200)}>
                                                                        <Close />
                                                                    </IconButton>
                                                                } severity={reportMessage == 201 ? "success" : "error"}>
                                                                    report update {reportMessage == 201 ? "successful" : "failed"}
                                                                </Alert>
                                                            }
                                                            {
                                                                getting
                                                                    ?
                                                                    <Box display="flex" alignItems="center" justifyContent={"space-around"}>

                                                                        {
                                                                            Array(7).fill().map(() => <Skeleton variant="circular" sx={{ height: 20, mr: 1, width: 20 }} />)
                                                                        }
                                                                    </Box>
                                                                    :
                                                                    project.report
                                                                        ?

                                                                        <Box>
                                                                            {
                                                                                approving
                                                                                    ?
                                                                                    <CircularProgress size={12} />
                                                                                    :
                                                                                    project.status == "approved"
                                                                                        ?
                                                                                        <IconButton color={group.delayed ? "error" : "success"}>
                                                                                            <FaCheckSquare />
                                                                                        </IconButton>
                                                                                        :
                                                                                        <IconButton title='approve group' onClick={approveProject} disabled={user.user_id != group.supervisor}>
                                                                                            <FaCheckSquare />
                                                                                        </IconButton>
                                                                            }
                                                                            <IconButton title='group statistics' onClick={() => navigate(`/grades/${group.id}`)}>
                                                                                <FaChartBar />
                                                                            </IconButton>
                                                                            {
                                                                                project.approved
                                                                                    ?
                                                                                    <IconButton

                                                                                        title='publish your document' color='success'>
                                                                                        <CloudUpload />
                                                                                    </IconButton>
                                                                                    :
                                                                                    <IconButton
                                                                                        onClick={() => navigate(`/publish/${project.id}`)}
                                                                                        title='publish your document' disabled={user.user_id != group.leader || project.status != "approved"}>
                                                                                        <CloudUpload />
                                                                                    </IconButton>
                                                                            }
                                                                            <IconButton target="_blank" title="view report" href={`https://kigongovincent.pythonanywhere.com${project.report}`}>
                                                                                <FaEye />
                                                                            </IconButton>
                                                                            {
                                                                                updating
                                                                                    ?
                                                                                    <CircularProgress size={14} />
                                                                                    :
                                                                                    user.user_id == group.leader || user.user_id == group.supervisor ?
                                                                                        <IconButton title="update report" disabled={project.status == "approved"}>
                                                                                            <InputLabel>
                                                                                                <FaPen color={project.status == "approved" && "lightgrey"} />
                                                                                                <Hidden />
                                                                                            </InputLabel>
                                                                                        </IconButton>
                                                                                        :
                                                                                        ''
                                                                            }
                                                                            <IconButton target="_blank" href={`https://kigongovincent.pythonanywhere.com${project.report}`} title="download or print report">
                                                                                <FaDownload />
                                                                            </IconButton>
                                                                            <IconButton title='information about the group' onClick={() => setInfo(true)} variant="contained">
                                                                                <Info />
                                                                            </IconButton>
                                                                        </Box>
                                                                        :
                                                                        user.userType != "student" || group.leader != user.user_id
                                                                            ?
                                                                            <Typography>Report unavailable</Typography>
                                                                            :
                                                                            <Button onClick={() => navigate(`/addreport/${group.id}`)} endIcon={<ArrowRight />}>
                                                                                upload a report
                                                                            </Button>
                                                            }
                                                        </Box>

                                                        <div ref={scroll} className='p-4' style={{ paddingTop: 2, overflowY: "scroll", maxHeight: "50vh" }}>
                                                            {
                                                                messages.length == 0
                                                                    ?
                                                                    <>
                                                                        <Typography re className='mt-5 pt-5' variant="h4" fontWeight={900}>
                                                                            No messages sent yet, be the first to say hi!
                                                                        </Typography>
                                                                        <Typography className='mb-5 pb-5 pt-2'>The more messages you send, the more points you score</Typography>
                                                                    </>
                                                                    :
                                                                    messages.map(message => <Message msg={message} />)
                                                            }



                                                        </div>
                                                    </>
                                                    <Box sx={{ px: 4, py: 1 }}>
                                                        {
                                                            project.status == "approved"
                                                                ?
                                                                <Typography>This group has been approved, therefore no one can send messages to this group</Typography>
                                                                :
                                                                <TextField
                                                                    disabled={project.approved || project.status == "approved"}
                                                                    fullWidth
                                                                    value={message}
                                                                    onChange={(e) => setMessage(e.target.value)}
                                                                    variant="outlined"
                                                                    InputProps={
                                                                        {
                                                                            endAdornment: (
                                                                                <InputAdornment>
                                                                                    <IconButton disabled={project.approved || project.status == "approved"}>
                                                                                        <InputLabel >
                                                                                            <FaCamera size={17} color={`${project.approved || project.status == "approved" && 'lightgrey'}`} />
                                                                                            {
                                                                                                !project.approved || project.status != "approved" ?
                                                                                                    <HiddenInput /> : ''
                                                                                            }
                                                                                        </InputLabel >
                                                                                    </IconButton>
                                                                                    {
                                                                                        sending
                                                                                            ?
                                                                                            <CircularProgress size={17} />
                                                                                            :
                                                                                            <IconButton disabled={project.approved || project.status == "approved"} onClick={sendMessage}>
                                                                                                <Send className='text-success' />
                                                                                            </IconButton>
                                                                                    }
                                                                                </InputAdornment>
                                                                            )
                                                                        }
                                                                    } label="send message" />
                                                        }

                                                    </Box>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                }
                            </Container>
                            <Backdrop open={info} sx={{ zIndex: 400 }}>
                                <Paper sx={{ p: 3, height: "75vh", width: "90%" }}>
                                    <Box display="flex" alignItems="center" justifyContent={'space-between'}>
                                        <Typography textTransform={"uppercase"}>About {group.name}</Typography>
                                        <IconButton sx={{ ml: 5 }} onClick={() => setInfo(false)}>
                                            <Close />
                                        </IconButton>
                                    </Box>
                                    {
                                        getting
                                            ?
                                            <>
                                                <Skeleton sx={{ height: "40vh" }} />
                                                <Skeleton sx={{ height: "10vh" }} />
                                            </>
                                            :
                                            project.id
                                                ?
                                                <Box >
                                                    <Typography variant="h4" fontWeight={"900"} sx={{ mt: 5 }}>{project.title}</Typography>
                                                    <br />
                                                    <Typography height={"30vh"} textAlign={"justify"} overflow={"scroll"}>
                                                        {project.abstract}
                                                    </Typography>
                                                    <Typography className="text-success my-3">
                                                        This group was created {getRelativeTime(group.date)}
                                                    </Typography>
                                                    {
                                                        project.approved
                                                            ?
                                                            <Button variant='contained' onClick={() => navigate(`/project/${project.id}`)} endIcon={<ArrowRightRounded />}>
                                                                view published project
                                                            </Button>
                                                            :
                                                            <Typography className="text-danger my-3 shadow-md px-4 py-2">
                                                                Deadline: {

                                                                    difference ? difference == 1 ?

                                                                        `Remaining with only today` : difference == 0 ? `your time is up` : difference > 1 ? `${difference} days remaining` : `Submission is due by ${Math.abs(difference)} days` : "Please refresh to clear error"}
                                                            </Typography>
                                                    }

                                                </Box>
                                                :
                                                <Typography variant="h4" className='p-4 text-center' fontWeight={900}>Project not found</Typography>
                                    }
                                </Paper>
                            </Backdrop>
                            <Dialog open={add}>
                                <DialogContent>
                                    <Box display="flex" sx={{ minWidth: 300 }} alignItems=" center" justifyContent={"space-between"}>
                                        <Typography>
                                            Add a member
                                        </Typography>
                                        <IconButton onClick={() => setAdd(false)}>
                                            <Close />
                                        </IconButton>
                                    </Box>
                                    <Typography sx={{ mt: 3, mb: 5 }}>
                                        Select a member that you would like to add
                                    </Typography>
                                    <Autocomplete value={new_student} onChange={(_, value) => setNew_student(value)} options={students.map(student => student?.email != user?.email && getName(student?.email))} renderInput={(params) => <TextField {...params} />} />
                                    <Button onClick={addMember} disabled={adding || !new_student} className='w-100 text-light mt-3' variant='contained' color="secondary">
                                        {
                                            adding
                                                ?
                                                <CircularProgress size={25} />
                                                :
                                                "Add member"
                                        }
                                    </Button>
                                    {
                                        failed && <Alert sx={{ mt: 3 }} severity='error' action={<IconButton onClick={() => setFailed(false)}>
                                            <Close />
                                        </IconButton>}>
                                            <Typography>
                                                Something went wrong!
                                            </Typography>
                                        </Alert>
                                    }
                                </DialogContent>
                            </Dialog>
                        </>
                        :
                        <Navigate to={"/"} />
            }

        </>
    )
}

export default Messages