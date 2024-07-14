import { Button, Container, IconButton, Box, Modal, Paper, Table, Typography, TextField, CircularProgress, Skeleton } from "@mui/material"
import UserNavigation from "../../components/UserNavigation"
import { CalendarToday, Cancel, Close, DateRange, Edit, Save } from "@material-ui/icons"
import { FaCalendarPlus, FaClock, FaPlus, FaRegClock } from "react-icons/fa"
import { useEffect, useRef, useState } from "react"
import { getRelativeTime } from "../../utilities/getRelativeTime"
import Date from '../../components/Date'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import moment from "moment"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { getAuthInformation } from "../../../src/model/slices/AuthReducer"

const Deadlines = () => {
    const [open, setOpen] = useState(false)
    const now = dayjs()
    const [saving, setSaving] = useState(false)
    const [date, setDate] = useState(now)
    const [updating, setUpdating] = useState(false)
    const [year, setYear] = useState("")
    const [loading, setLoading] = useState(false)
    const [currentDeadline, setCurrentDeadline] = useState(null)
    const [deadlines, setDeadlines] = useState(JSON.parse(localStorage.getItem("deadlines")))

    const [statistics, setStatistics] = useState({})

    const getStatistics = async () => {

    }

    const user = useSelector(getAuthInformation)
    const addDeadline = async () => {

        setSaving(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/deadlines/`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${user.tokens.access}`
            },
            body: JSON.stringify({
                academic_year: year,
                deadline: dayjs(date).format("YYYY-MM-DD")
            })

        })

        if (response.status == 201) {
            const data = await response.json()
            setDeadlines(data)
            localStorage.setItem("deadlines", JSON.stringify(data))
            setOpen(false)
            setSaving(false)
        }
        else {
            setSaving(false)
            alert('something went wrong, try again')

        }
    }

    const update = (id, date, year) => {
        setOpen(true)
        setDate(date)
        setYear(year)
        setUpdating(true)
        setCurrentDeadline(id)
    }

    const updateDeadline = async () => {
        setSaving(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/edit_deadline/${currentDeadline}`, {
            method: "PATCH",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${user.tokens.access}`
            },
            body: JSON.stringify({
                academic_year: year,
                deadline: dayjs(date).format("YYYY-MM-DD")
            })
        })
        if (response.status == 202) {
            const data = await response.json()
            setDeadlines(data)
            localStorage.setItem("deadlines", JSON.stringify(data))
            setSaving(false)
            setOpen(false)
        } else {
            alert('failed to update')
            setSaving(false)
        }
    }
    return (
        <>

            {
                user.userType == "librarian" || user?.userType == "cordinator"
                    ?
                    <>
                        <UserNavigation />
                        <Container sx={{ mt: 13 }}>
                            {
                                loading
                                    ?
                                    <>
                                        <Skeleton height={"50vh"} />
                                        <Skeleton height={"10vh"} />
                                    </>
                                    : <>
                                        <Button onClick={() => setOpen(true)} className="text-light" color="secondary" variant="contained" startIcon={<FaCalendarPlus size={14} />}>
                                            add deadline
                                        </Button>
                                        <table className="mt-4" style={{ overflow: "scroll" }}>
                                            {
                                                deadlines.length != 0 && <tr className="text-light">
                                                    <td className=" py-2 px-3 text-light">
                                                        <b>Academic Year</b>
                                                    </td>
                                                    <td>
                                                        <b>Deadline</b>
                                                    </td>
                                                    <td>
                                                        <b>Created</b>
                                                    </td>
                                                    <td>
                                                        <b>Last updated</b>
                                                    </td>
                                                    <td></td>
                                                </tr>

                                            }
                                            {
                                                deadlines.length == 0
                                                    ?
                                                    <Typography>
                                                        No deadlines found
                                                    </Typography>
                                                    :
                                                    deadlines.map(deadline => (
                                                        <tr className="shadow-md">
                                                            <td className="py-3 px-3">{deadline.academic_year}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <DateRange className="text-success" style={{ marginRight: 10 }} />
                                                                    {deadline.deadline}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <FaClock color="#F34342" style={{ marginRight: 10 }} />{getRelativeTime(deadline.date)}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <FaRegClock color="#F34342" style={{ marginRight: 10 }} />{getRelativeTime(deadline.updated)}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <IconButton onClick={() => update(deadline.id, deadline.deadline, deadline.academic_year)}>
                                                                    <Edit />
                                                                </IconButton>
                                                            </td>

                                                        </tr>
                                                    ))
                                            }
                                        </table>
                                    </>
                            }
                        </Container>
                        <Modal open={open} className="d-flex align-items-center justify-content-center">
                            <Paper className=" px-4 py-2">
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="caption">
                                        Add deadline
                                    </Typography>
                                    <IconButton onClick={() => { setUpdating(false); setYear(''); setSaving(false); setDate(now);; setOpen(false); setYear('') }}>
                                        <Close />
                                    </IconButton>
                                </Box>
                                <Box >
                                    <Typography sx={{ mt: 1 }}>

                                    </Typography>
                                    <TextField value={year} onChange={(e) => setYear(e.target.value)} className="w-100 my-3" label="Academic year" placeholder="YYYY-MM-DD -- YYYY-MM-DD" helperText={'academic years must be unique'} />
                                </Box>
                                <Box >
                                    <div >
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>


                                            <Typography className="text-danger">Deadline for submission</Typography>
                                            <DateCalendar className="shadow-md my-4 text-danger" value={dayjs(date)} onChange={(value) => setDate(value)} />
                                        </LocalizationProvider>
                                    </div>
                                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"}>
                                        <Button color="error" onClick={() => { setUpdating(false); setYear(''); setSaving(false); setDate(now); setOpen(false) }} startIcon={<Cancel />} sx={{ mr: 2 }}>
                                            cancel
                                        </Button>
                                        {
                                            updating
                                                ?
                                                <Button color="success" onClick={updateDeadline} disabled={saving} startIcon={<Save />}>
                                                    {
                                                        saving
                                                            ?
                                                            <CircularProgress size={12} />
                                                            :
                                                            "save changes"
                                                    }
                                                </Button>
                                                :
                                                <Button color="success" onClick={addDeadline} disabled={saving} startIcon={<FaPlus size={
                                                    14
                                                } />}>
                                                    {
                                                        saving
                                                            ?
                                                            <CircularProgress size={12} />
                                                            :
                                                            "Add deadline"
                                                    }
                                                </Button>
                                        }
                                    </Box>
                                </Box>
                            </Paper>
                        </Modal>
                    </>
                    :
                    <Navigate to={`/`} />
            }
        </>
    )
}
export default Deadlines