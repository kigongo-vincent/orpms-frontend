import { Container, CircularProgress, TextField, Button, Paper, Skeleton, Typography, Box } from '@mui/material'
import Navbar from '../../components/UserNavigation'
import { useEffect, useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import UserProfile from '../../components/UserProfile'
import { ArrowRight } from '@material-ui/icons'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAuthInformation } from '../../../src/model/slices/AuthReducer'
const Cordinator = () => {

    const [loading, setLoading] = useState(false)

    const [sending, setSending] = useState(false)

    const [supervisors, setSupervisors] = useState([])

    const [name, setName] = useState("")

    const navigate = useNavigate()

    const user = useSelector(getAuthInformation)

    const getSuperVisors = async () => {

        setLoading(true)

        const response = await fetch("https://kigongovincent.pythonanywhere.com/all_supervisors")

        if (response.status == 200) {

            const data = await response.json()

            setSupervisors(data)

            setLoading(false)

        }

        else {
            setLoading(false)
        }


    }

    const addSupervisor = async () => {

        setSending(true)

        const formData = new FormData()

        formData.append("email", name)
        formData.append("password", "####")
        formData.append("role", "lecturer")

        const response = await fetch('https://kigongovincent.pythonanywhere.com/all_supervisors/', {
            method: "POST",
            body: formData
        })

        if (response.status == 201) {
            const data = await response.json()

            setSupervisors([...supervisors, data])

            setSending(false)

            setName("")
        }
        else {
            alert("Attempt Failed")
            setSending(false)
        }

    }

    useEffect(() => {

        getSuperVisors()

    }, [])

    return (
        <>

            <Navbar />

            <Container sx={{ mt: 13 }}>

                {
                    user?.userType != "cordinator"
                        ?
                        <Navigate to={"/"} />
                        :
                        loading
                            ?
                            <>
                                <Skeleton height={"50vh"} />
                                <Skeleton height={"10vh"} />
                            </>
                            :
                            <>
                                <Box>
                                    <TextField value={name} onChange={(e) => setName(e.target.value)} label="Supervisor's Webmail" helperText="please ensure the supervisor you are adding is non existant in the system" className="my-3 w-40" /> <br />
                                    <Button onClick={addSupervisor} className="text-light" variant="contained" disabled={sending ||
                                        !name ||
                                        !name?.includes("@cit.mak.ac.ug")} startIcon={<FaPlusCircle size={12} />} color="secondary">
                                        {
                                            sending

                                                ?
                                                <CircularProgress size={17} />
                                                :
                                                "add supervisor"
                                        }
                                    </Button>
                                </Box>

                                <Box>
                                    {
                                        supervisors.length == 0

                                            ?

                                            <Typography sx={{ my: 3 }}>No supervisors found</Typography>

                                            :

                                            <Box flexWrap={"wrap"} className="my-4 d-flex align-items-center justify-conent-start">

                                                {
                                                    supervisors.map(supervisor => (
                                                        <Paper elevation={0} sx={{ mr: 1, mt: 1 }} className=' w-20'>
                                                            <UserProfile user_id={supervisor.id} />
                                                            <Button onClick={() => navigate(`/cordinator/groups/${supervisor.id}`)} color='secondary' sx={{ mx: 1, my: 3 }} endIcon={<ArrowRight />}>
                                                                <Typography textTransform={"lowercase"}>View groups supervised</Typography>
                                                            </Button>
                                                        </Paper>
                                                    ))
                                                }


                                            </Box>
                                    }
                                </Box>
                            </>
                }

            </Container>
        </>
    )
}

export default Cordinator