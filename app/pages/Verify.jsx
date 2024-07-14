import { Alert, Box, Button, CircularProgress, Container, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material"
import Logo from '../../src/assets/svgs/muk.svg'
import { ArrowRight, Close, Edit } from "@material-ui/icons"
import { useState } from "react"
import { FaEye } from 'react-icons/fa'
import { Link, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getAuthInformation, OTP_SIGNIN } from "../../src/model/slices/AuthReducer"
import { motion } from 'framer-motion'
const Verify = () => {

    const dispatch = useDispatch()

    const [OTP, setOTP] = useState("") //webmail input storage

    const auth = useSelector(getAuthInformation)

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(false)


    const handleSubmit = async () => {

        setLoading(true)

        const response = await fetch(`https://kigongovincent.pythonanywhere.com/verification/`, {
            method: "POST",
            body: JSON.stringify({
                OTP: OTP
            }),
            headers: {
                "Content-type": "application/json"
            }
        })

        if (response.status == 200) {
            const data = await response.json()

            dispatch(OTP_SIGNIN(data))
            setLoading(true)


        }
        else {
            setLoading(false)
            setError(true)
        }
    }

    return (
        // container 
        <>
            {
                auth.isLoggedIn
                    ?
                    <Navigate to={`/lecturer`} />
                    :
                    <Box height={"100vh"} width={"100vw"} display={"flex"} alignItems={"center"} justifyContent={"center"}>

                        {/* div containing Verify components */}
                        <Container maxWidth={"sm"}>
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                            >
                                <Paper className="p-5 rounded shadow-sm text-center" elevation={0}>
                                    <img width={400} src={Logo} />

                                    {/* text input for OTP  */}
                                    <TextField value={OTP} type="password" onChange={(e) => setOTP(e.target.value)} helperText="provide the OTP that was sent to your webmail" label="OTP" className="w-100 mt-5" />
                                    {/* end text input for OTP  */}

                                    {/* container for request button  */}
                                    <Box sx={{ mt: 5 }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>

                                        <Link className="nav-link text-success" to={"/OTP"}>
                                            Re-enter webmail
                                        </Link>

                                        {/* submit button  */}
                                        <Button disabled={auth.loading} onClick={handleSubmit} variant="contained" endIcon={<ArrowRight />}>
                                            {
                                                loading
                                                    ?
                                                    <CircularProgress size={14} className="text-light" />
                                                    :
                                                    "verify OTP"
                                            }
                                        </Button>
                                        {/* end submit button  */}

                                    </Box>
                                    {/* end container for request button  */}

                                    {/* if anything goes wrong */}
                                    {
                                        error
                                        &&
                                        <Alert severity="error" sx={{ mt: 2 }} action={<IconButton onClick={() => setError(false)}><Close /></IconButton>}>
                                            <Typography>
                                                Invalid OTP, please try again
                                            </Typography>

                                        </Alert>
                                    }
                                    {/* end if anything goes wrong */}

                                </Paper>
                            </motion.div>
                        </Container>
                        {/* div containing Verify components */}

                    </Box>
            }
        </>
    )
}
export default Verify