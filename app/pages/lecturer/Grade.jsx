import { Alert, Box, Button, CircularProgress, colors, Card, Container, Grid, IconButton, Paper, Skeleton, Slider, Typography } from "@mui/material"
import UserNavigation from "../../components/UserNavigation"
import UserProfile from "../../components/UserProfile"
import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { ArrowBack, Close, Restore, Save } from "@material-ui/icons"
import { LineChart } from '@mui/x-charts'
import { getName } from '../../utilities/getName'
import { useDispatch, useSelector } from "react-redux"
import { addExternalNotifications, addNotifications, getAuthInformation } from "../../../src/model/slices/AuthReducer"
const Grade = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [records, setRecords] = useState([])
    const navigate = useNavigate()
    const [sending, setSending] = useState(false)
    const [code, setCode] = useState(200)
    const [userData, setUserData] = useState([])

    let group

    try {
        group = JSON.parse(localStorage.getItem("data"))
    }
    catch {
        group = { supervisor: 0 }
    }


    const user = useSelector(getAuthInformation)


    const getMessages = async () => {
        // setLoading(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/messages/${id}`)
        if (response.status == 200) {
            const data = await response.json()

            let new_array = []

            data.forEach(element => {
                if (!new_array.some(msg => msg.author == element.author)) {
                    new_array.push({
                        author: element.author,
                        email: JSON.parse(localStorage.getItem("data")).supervisor == element.author ? `${getName(element.email, true)}(s)` : getName(element.email, true),
                        number_of_messages: 1
                    })
                } else {
                    new_array = new_array.map(obj => obj.author == element.author ? { ...obj, number_of_messages: obj.number_of_messages + 1 } : obj)
                }
                records.forEach(record => {
                    if (!new_array.some(item => item.author == record.student)) {
                        new_array.push({
                            author: record.student,
                            number_of_messages: 0,
                            email: getName(record.email, true)
                        })
                    }
                })
                setUserData(new_array)
                // setLoading(false)
            })


        } else {
            // setLoading(false)
        }
    }

    const dispatch = useDispatch()
    const getGrades = async () => {
        setLoading(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/grades/${id}`)
        if (response.status == 200) {
            const data = await response.json()
            setRecords(data)
            setLoading(false)
        }
        setLoading(false)
    }

    useEffect(() => {
        getGrades()
        getMessages()
    }, [id])

    useEffect(() => {
        getMessages()
    }, [records])

    const grade = (student, mark) => {
        let new_records = records.map(record => record.student == student ? { ...record, score: mark, updated: true } : record)
        setRecords(new_records)
    }
    const reset = () => {
        let new_records = records.map(record => ({ ...record, score: 0 }))
        setRecords(new_records)
    }

    const save = async () => {
        setSending(true)
        for (let index = 0; index < records.length; index++) {
            dispatch(addExternalNotifications(
                {
                    reciever: records[index].student,
                    message: `Your supervisor ${user.username} in ${group.name} has awarded you ${records[index].score}%`,
                    severity: records[index].score < 50 ? "error" : records[index].score > 80 ? "success" : "warning"
                }
            ))
            dispatch(addNotifications(
                {
                    reciever: user.user_id,
                    message: `You have awarded ${records[index].score}% to ${getName(records[index].email)} (member of ${group.name})`,
                    severity: records[index].score < 50 ? "error" : records[index].score > 80 ? "success" : "warning"
                }
            ))
            let response = await fetch(`https://kigongovincent.pythonanywhere.com/change_grades/${records[index].id}`, {
                method: "PATCH",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ score: records[index].score })
            })
            if (response.status != 201) {
                setCode(400)
                setSending(false)
            } else {
                setCode(201)
                setSending(false)
            }

        }
        setSending(false)

    }
    return (
        <>
            {
                !user.isLoggedIn
                    ?
                    <Navigate to={"/"} />
                    :
                    <>
                        <UserNavigation />
                        <Container sx={{ mt: 12 }} >
                            <Grid container>
                                <Grid item lg={6} xs={12}>
                                    <Paper elevation={0} sx={{ height: "80vh", p: 4, overflowY: "scroll" }}>
                                        <u><Typography sx={{ mb: 1 }} variant="h5" fontWeight={700} textAlign={"center"}>
                                            Student marks
                                        </Typography></u>
                                        {
                                            user.userType == "lecturer"
                                                ?
                                                group.supervisor != user.user_id || group.status != "pending"
                                                    ?
                                                    <Typography sx={{ mb: 2 }} textAlign={"center"}>
                                                        (These marks can no longer be changed)
                                                    </Typography>
                                                    :
                                                    <Typography sx={{ mb: 2 }} textAlign={"center"}>
                                                        (use the slider to award marks for a given student)
                                                    </Typography>
                                                :
                                                <Typography sx={{ mb: 2 }} textAlign={"center"}>
                                                    (These are marks awarded to you by your supervisor)
                                                </Typography>
                                        }
                                        {
                                            loading ?
                                                <Skeleton sx={{ height: "30vh" }} />
                                                :
                                                records.length == 0
                                                    ?
                                                    <Typography variant="h4" fontWeight={900} textAlign={"center"}>
                                                        student records not found
                                                    </Typography>
                                                    :
                                                    <>
                                                        {
                                                            records.map((record) => (
                                                                <Grid key={record.student} container gap={1} justifyContent={"center"} alignItems={"center"}>
                                                                    <Grid item lg={5} xs={12}>
                                                                        <UserProfile user_id={record.student} />
                                                                    </Grid>
                                                                    <Grid item lg={3} xs={8}>
                                                                        <Slider sx={{ minWidth: 50 }} size="small" disabled={group.supervisor != user.user_id || group.status != "pending"} color={record.score < 50 ? "error" : record.score > 80 ? "success" : "warning"} onChange={(_, newScore) => grade(record.student, newScore)} value={record.score} />
                                                                    </Grid>
                                                                    <Grid item lg={1} xs={2}>
                                                                        <Typography textAlign={"center"}>
                                                                            {record.score}%
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>

                                                            ))
                                                        }
                                                        {
                                                            group.supervisor != user.user_id || group.status != "pending"
                                                                ?
                                                                ''
                                                                :

                                                                <Box sx={{ mt: 3 }} display={"flex"} alignItems={"center"} justifyContent={"center"}>

                                                                    <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />}>
                                                                        cancel
                                                                    </Button>
                                                                    <Button onClick={reset} startIcon={<Restore />} sx={{ mx: 2 }}>
                                                                        reset
                                                                    </Button>
                                                                    <Button onClick={save} startIcon={!sending && <Save />}>
                                                                        {
                                                                            sending
                                                                                ? <>
                                                                                    <CircularProgress size={14} className="text-secondary mx-2" />
                                                                                    saving
                                                                                </>
                                                                                :
                                                                                "Save"
                                                                        }
                                                                    </Button>
                                                                </Box>
                                                        }
                                                        {
                                                            code == 201 ? <Alert onClick={() => setCode(200)} sx={{ mt: 3, position: "fixed", top: "10%", left: "40%" }} action={<IconButton>
                                                                <Close />
                                                            </IconButton>} severity="success">
                                                                <Typography>
                                                                    Records updated successfully
                                                                </Typography>
                                                            </Alert>
                                                                :
                                                                code == 400 &&
                                                                <Alert onClick={() => setCode(200)} sx={{ mt: 3 }} action={<IconButton>
                                                                    <Close />
                                                                </IconButton>} severity="error">
                                                                    <Typography>
                                                                        Something went wrong, please try again
                                                                    </Typography>
                                                                </Alert>
                                                        }
                                                    </>
                                        }
                                    </Paper>
                                </Grid>
                                <Grid item lg={6} >
                                    <Card elevation={0} sx={{ height: "80vh" }} className="d-flex px-4 mx-lg-2 mx-0 my-lg-0 my-4 align-items-center flex-column justify-content-center text-center">

                                        <u><Typography variant="h5" fontWeight={"bold"} sx={{ mt: 4, px: 3, mb: 1 }} color="primary">Group participation statistics</Typography></u>
                                        <Typography variant="caption" sx={{ px: 4 }}>
                                            (This ranking is based off number of messages sent by members in the group)
                                        </Typography>

                                        <LineChart

                                            height={300}
                                            series={[{ data: userData.map(info => info.number_of_messages), label: 'messages count', area: true, showMark: true }]}
                                            xAxis={[{ scaleType: 'point', data: userData.map(info => info.email) }]}
                                            colors={[colors.grey[400]]}
                                            sx={{
                                                '.MuiLineElement-root': {
                                                    display: 'none',
                                                },
                                            }}
                                        />

                                    </Card>
                                </Grid>
                            </Grid>
                        </Container>
                    </>
            }
        </>
    )
}
export default Grade
