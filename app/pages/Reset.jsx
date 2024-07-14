import { ArrowRight } from '@material-ui/icons'

import { Box, Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material'

import React, { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getAuthInformation, OTP_SIGNIN } from '../../src/model/slices/AuthReducer'

const Reset = () => {

    const { id } = useParams()

    const [password, setPassword] = useState("")

    const [password2, setPassword2] = useState("")

    const [resetting, setResetting] = useState(false)

    const user = useSelector(getAuthInformation)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const reset = async (e) => {

        e.preventDefault()

        setResetting(true)

        try {

            const response = await fetch(`https://kigongovincent.pythonanywhere.com/update_password/${id}`, {

                method: "POST",

                headers: {
                    "Content-type": "application/json"
                },

                body: JSON.stringify({ password })

            })

            if (response.status == 202) {

                const data = await response.json()

                dispatch(OTP_SIGNIN(data))

            }

            else if (response.status == 403) {
                alert("This link is expired, please request for another link from the login page")
            }
            else {
                alert("Failed to update password, please try again")
            }

        }
        catch (err) {

            alert("Something went wrong, please check you email and try again")

        }
        finally {
            setResetting(false)
        }

    }
    return (


        user?.isLoggedIn

            ?

            <Navigate to={"/"} />

            :

            <form onSubmit={reset}>

                <Box height={"100vh"} width={"100vw"} className="d-flex align-items-center justify-content-center">

                    <Container maxWidth="xs">

                        <Paper elevation={0} className="p-5 d-flex flex-column align-items-center justify-content-center">

                            <Typography variant='h5' fontWeight={"bold"}>Password reset</Typography>
                            <Typography sx={{ mt: 2, mb: 3 }}>Please provide you new password</Typography>

                            <TextField value={password} type='password' onChange={(e) => setPassword(e.target.value)} className='w-100' label="you new password" />
                            <TextField value={password2} type='password' onChange={(e) => setPassword2(e.target.value)} className='w-100 my-4' label="Confirm your password" />

                            <Button

                                type='submit'

                                color='secondary'

                                disabled={

                                    password.length < 4 || !password2 || resetting || password != password2
                                }

                                className='w-100' variant='contained' endIcon={<ArrowRight />}>

                                {

                                    resetting

                                        ?

                                        <CircularProgress size={15} />

                                        :

                                        <Typography textTransform={"lowercase"}>Continue</Typography>

                                }

                            </Button>

                            <u className='text-danger' role='button' onClick={() => navigate("/login")}><Typography sx={{ mt: 3 }}>Back to login</Typography></u>

                        </Paper>

                    </Container>

                </Box>

            </form>
    )
}

export default Reset