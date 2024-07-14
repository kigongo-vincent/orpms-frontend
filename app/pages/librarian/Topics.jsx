import { Container, Typography, Box, Skeleton, Button, TextField, Paper, CircularProgress } from "@mui/material"
import UserNavigation from "../../components/UserNavigation"
import { useState } from "react"
import { getAllTopics, getTopics } from "../../../src/model/slices/ProjectsReducer"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { FaPlusCircle } from "react-icons/fa"
import { Navigate, useNavigate } from "react-router-dom"
import { getAuthInformation } from "../../../src/model/slices/AuthReducer"
const Topics = () => {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const user = useSelector(getAuthInformation)
    const topics = useSelector(getAllTopics)
    const [sending, setSending] = useState(false)
    const [name, setName] = useState("")
    const navigate = useNavigate()
    useEffect(() => {
        setLoading(true)
        dispatch(getTopics())
        setLoading(false)
    }, [])

    const addTopic = async () => {
        setSending(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/topics/`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${user.tokens.access}`
            },
            body: JSON.stringify({
                name: name?.toUpperCase()
            })
        })
        if (response.status == 201) {
            dispatch(getTopics())
            setSending(false)
            setName("")
        }
        else {
            setSending(false)
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
                                    :
                                    <>
                                        <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                                            <Typography>
                                                Available topics
                                            </Typography>

                                        </Box>
                                        <Box>
                                            <TextField value={name} onChange={(e) => setName(e.target.value)} label="Topic" helperText="please ensure the topic you are adding is non existant" className="my-3 w-40" /> <br />
                                            <Button onClick={addTopic} className="text-light" variant="contained" disabled={sending} startIcon={<FaPlusCircle size={12} />} color="secondary">
                                                {
                                                    sending
                                                        ?
                                                        <CircularProgress size={17} />
                                                        :
                                                        "add topic"
                                                }
                                            </Button>
                                        </Box>
                                        <Box sx={{ mt: 3 }}>
                                            {
                                                topics.length != 0
                                                    ?
                                                    <Paper elevation={0} sx={{ p: 5 }}>
                                                        <Typography fontWeight={"bold"} letterSpacing={2}>TOPICS</Typography> <hr />
                                                        {
                                                            topics.map(topic => (
                                                                <Button className="shadow-md" sx={{ mr: 2, mb: 2 }} onClick={() => navigate(`/topic/${topic.name}`)}>
                                                                    {topic.name}
                                                                </Button>
                                                            ))
                                                        }
                                                    </Paper>

                                                    :
                                                    <Typography variant="h5" fontWeight={"bold"}>No topics found</Typography>
                                            }
                                        </Box>
                                        <Box>

                                        </Box>
                                    </>
                            }
                        </Container>
                    </>
                    :
                    <Navigate to={"/"} />
            }
        </>
    )
}
export default Topics