import { House, Close, Group, GraphicEq, GroupAddTwoTone, Dashboard, CheckCircle, CalendarTodayRounded, Bookmark, BookSharp, BarChart } from '@material-ui/icons'
import { FaBookDead, FaBroadcastTower, FaCamera, FaChalkboardTeacher, FaSignOutAlt, FaUser, FaUsers } from 'react-icons/fa'
import { Drawer, List, Box, Typography, ListItemText, IconButton, ListItemButton, Avatar, Badge, InputLabel, CircularProgress, colors } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addNotifications, format, update_dp } from '../../src/model/slices/AuthReducer'
import { useEffect, useState } from 'react'
const Sidebar = ({ open, user, setOpen }) => {



    const navigate = useNavigate()
    const [updating, setUpdating] = useState(false)
    const dispatch = useDispatch()
    const Logout = () => {
        let logout = confirm("Are you sure you want to logout")
        if (logout) {
            localStorage.removeItem("user")
            localStorage.removeItem("data")
            navigate(user.previousPage ? user.previousPage : "/")
            setOpen(false)
            dispatch(format())
        }
    }
    const [photo, setPhoto] = useState(null)
    const HiddenInput = () => {
        return (
            <input type="file" accept='.png, .jpg, .jpeg' onChange={(e) => setPhoto(e.currentTarget.files[0])} className="d-none" />
        )
    }

    const location = useLocation()

    const currentPage = location.pathname


    const update_user = async () => {
        if (photo && user) {
            setUpdating(true)
            const formData = new FormData()
            formData.append("photo", photo)
            const response = await fetch(`https://kigongovincent.pythonanywhere.com/update_user/${user.user_id}`, {
                method: "PATCH",
                body: formData
            })
            if (response.status == 201) {
                const data = await response.json()
                const savedUser = JSON.parse(localStorage.getItem("user"))

                savedUser.photo = 'https://kigongovincent.pythonanywhere.com' + data.photo
                localStorage.setItem("user", JSON.stringify(savedUser))
                dispatch(addNotifications({
                    message: "You have updated your profile picture",
                    severity: "info",
                    reciever: user.user_id
                }))
                dispatch(update_dp('https://kigongovincent.pythonanywhere.com' + data.photo))
                setUpdating(false)
            }
            setUpdating(false)
        }
    }
    useEffect(() => {
        if (photo && user) {
            update_user()
        }
    }, [photo])


    useEffect(() => {
        console.log(currentPage)
    }, [currentPage])
    return (
        <Drawer open={open} >

            <List>
                <Box sx={{ px: 2 }} display="flex" alignItems="center" justifyContent={"flex-end"}>
                    <IconButton onClick={() => setOpen(false)}>
                        <Close />
                    </IconButton>
                </Box>
                <Box display="flex" className="bg-dark text-light" alignItems={"center"} justifyContent={"center"} flexDirection={"column"} sx={{ px: 5, py: 2, mb: 2 }}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        badgeContent={
                            updating
                                ?
                                <CircularProgress size={15} className='text-light' />
                                :
                                <IconButton>
                                    <InputLabel>
                                        <FaCamera color='aliceblue' />
                                        <HiddenInput />
                                    </InputLabel>
                                </IconButton>}
                    >
                        <Avatar src={user.photo} sx={{ width: 70, height: 70 }} />
                    </Badge>
                    <Typography sx={{ my: 1 }}>{user.username}</Typography>
                    <Typography variant="caption" >{user.userType}</Typography>
                </Box>
                {
                    user.userType != "lecturer" && <ListItemButton className={`px-5 ${currentPage == "/" || currentPage.includes("project") || currentPage.includes("topic/") || currentPage.includes("supervisor") || currentPage.includes("year") ? 'text-danger' : ''}`} onClick={() => { setOpen(false); navigate('/') }}>
                        <House />
                        <ListItemText sx={{ mx: 2 }} >Home page</ListItemText>
                    </ListItemButton>
                }

                {
                    user?.userType == "librarian" && <ListItemButton onClick={() => { setOpen(false); navigate(`/librarian`) }} className={`px-5 ${currentPage == "/librarian" && 'text-danger'}`}>
                        <BarChart />
                        <ListItemText sx={{ mx: 2 }}>
                            statistics
                        </ListItemText>
                    </ListItemButton>
                }
                {
                    user.userType == "lecturer"
                        ?
                        <>
                            <ListItemButton onClick={() => { setOpen(false); navigate(`/lecturer`) }} className={`px-5 ${currentPage == "/lecturer" && 'text-danger'}`}>
                                <Dashboard />
                                <ListItemText sx={{ mx: 2 }}>
                                    Dashboard
                                </ListItemText>
                            </ListItemButton>
                            <ListItemButton onClick={() => { setOpen(false); navigate(`/groups`) }} className={`px-5 ${currentPage.includes("group") || currentPage.includes("grade") ? 'text-danger' : ''}`}>
                                <Group />
                                <ListItemText sx={{ mx: 2 }}>
                                    Groups you supervise
                                </ListItemText>
                            </ListItemButton>
                            <ListItemButton onClick={() => { setOpen(false); navigate(`/published`) }} className={`px-5 ${currentPage == "/published" && 'text-danger'}`}>
                                <CheckCircle />
                                <ListItemText sx={{ mx: 2 }}>
                                    projects you approved
                                </ListItemText>
                            </ListItemButton>
                        </>
                        :
                        user.userType == "cordinator"
                            ? <>
                                <ListItemButton onClick={() => { setOpen(false); navigate(`/librarian`) }} className={`px-5 ${currentPage == "/librarian" && 'text-danger'}`}>
                                    <Dashboard />
                                    <ListItemText sx={{ mx: 2 }}>
                                        Dashboard
                                    </ListItemText>
                                </ListItemButton>
                                <ListItemButton onClick={() => { setOpen(false); navigate(`/deadlines`) }} className={`px-5 ${currentPage == "/deadlines" && 'text-danger'}`}>
                                    <CalendarTodayRounded />
                                    <ListItemText sx={{ mx: 2 }}>
                                        Deadlines
                                    </ListItemText>
                                </ListItemButton>
                                <ListItemButton onClick={() => { setOpen(false); navigate(`/add_topic`) }} className={`px-5 ${currentPage == "/add_topic" && 'text-danger'}`}>
                                    <Bookmark />
                                    <ListItemText sx={{ mx: 2 }}>
                                        Add or view Topic(s)
                                    </ListItemText>
                                </ListItemButton>
                                <ListItemButton onClick={() => { setOpen(false); navigate(`/courses`) }} className={`px-5 ${currentPage == "/courses" && 'text-danger'}`}>
                                    <BookSharp />
                                    <ListItemText sx={{ mx: 2 }}>
                                        Add or view Course(s)
                                    </ListItemText>
                                </ListItemButton>
                                <ListItemButton onClick={() => { setOpen(false); navigate(`/cordinator`) }} className={`px-5 ${currentPage.includes("/cordinator") && 'text-danger'}`}>
                                    <FaChalkboardTeacher size={17} />
                                    <ListItemText sx={{ mx: 2 }}>
                                        Supervisors(s)
                                    </ListItemText>
                                </ListItemButton>
                                <ListItemButton onClick={() => { setOpen(false); navigate(`/view_projects`) }} className={`px-5 ${currentPage.includes("/view_projects") && 'text-danger'}`}>
                                    <FaBookDead size={17} />
                                    <ListItemText sx={{ mx: 2 }}>
                                        Projects
                                    </ListItemText>
                                </ListItemButton>
                                <ListItemButton onClick={() => { setOpen(false); navigate(`/broadcast`) }} className={`px-5 ${currentPage.includes("/broadcast") && 'text-danger'}`}>
                                    <FaBroadcastTower size={17} />
                                    <ListItemText sx={{ mx: 2 }}>
                                        Broadcast
                                    </ListItemText>
                                </ListItemButton>
                            </>
                            :
                            user.has_group
                                ?
                                <ListItemButton onClick={() => { setOpen(false); navigate(`/group/${user.user_id}`) }} className={`px-5 ${currentPage.includes("group") || currentPage.includes("grades") ? 'text-danger' : ''}`}>
                                    <Group />
                                    <ListItemText sx={{ mx: 2 }}  >View your group</ListItemText>
                                </ListItemButton>
                                :
                                user?.userType == "student" &&
                                <ListItemButton onClick={() => { setOpen(false); navigate(`/addgroup/${user.user_id}`) }} className={`px-5 ${currentPage.includes("addgroup") && 'text-danger'}`}>
                                    <Group />
                                    <ListItemText sx={{ mx: 2 }} >Create a group</ListItemText>
                                </ListItemButton>

                }

                <ListItemButton className="px-5" onClick={Logout}>
                    <FaSignOutAlt size={17} />
                    <ListItemText sx={{ mx: 2 }}>Logout</ListItemText>
                </ListItemButton>
            </List>
            <Typography variant="caption" className='d-none d-lg-block position-absolute bottom-0 m-5'>

            </Typography>

        </Drawer>
    )
}

export default Sidebar