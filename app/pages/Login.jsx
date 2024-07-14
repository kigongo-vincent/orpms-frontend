import { Box, Container, Paper, Button, TextField, Typography, Link, CircularProgress, Alert, checkboxClasses, Dialog, DialogContent, IconButton } from '@mui/material'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ArrowRight, Close } from '@material-ui/icons'
import { Navigate } from 'react-router-dom'
// logo
import { verifyPassword } from '../utilities/passwordCheck'
import Logo from '../../src/assets/svgs/muk.svg'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAuthInformation, loginUser } from '../../src/model/slices/AuthReducer'
const Login = () => {
    const [webmail, setWebmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate('/')

    const user = useSelector(getAuthInformation)

    const [resetting, setResetting] = useState(false)

    const [my_webmail, setMy_webmail] = useState("")

    const [open, setOpen] = useState(false)

    const dispatch = useDispatch()

    const [checked, setChecked] = useState(false)


    const [error, setError] = useState(true)

    const resetPassword = async () => {

        setResetting(true)

        const res = await fetch(`https://kigongovincent.pythonanywhere.com/reset_password/${my_webmail}`)

        if (res.status == 202) {

            alert("Please check you email for instructions on how to reset your password")

            setResetting(false)

            setOpen(false)

        } else {

            setResetting(false)

            alert("Failed to reset password, pleas try again")

        }

    }



    const handleSubmit = () => {
        const formData = new FormData()
        formData.append("email", webmail)
        formData.append("password", password)
        dispatch(loginUser(formData))
    }

    function isFormValid() {
        if (webmail.includes('@') && webmail.length > 3) {


        } else {
            setError(true)
        }
    }

    useEffect(() => {
        if (password) {
            // const is_valid = verifyPassword(password)
            // if(is_valid){
            //     setError(false)
            // }else{
            //     setError(true)
            // }
            setError(false)
        }
    }, [password])

    useEffect(() => isFormValid(), [webmail, password])
    return (
        <>
            {
                user.isLoggedIn ?
                    user?.userType == "lecturer"
                        ?
                        <Navigate to={'/lecturer'} />
                        :
                        <Navigate to={user.previousPage ? user.previousPage : '/'} />
                    :
                    <Container maxWidth="sm">

                        <Box
                            sx={{ height: '100vh' }}
                            display="flex"
                            flexDirection={'column'}
                            alignItems={'center'}
                            justifyContent={"center"}>


                            <Paper elevation={0} className='py-5 d-flex align-items-center flex-column bg-image shadow-sm'>

                                {/* logo  */}
                                <img src={Logo} alt="" className=' mb-4' width="80%" />
                                {/* end logo  */}

                                {/* email input  */}
                                <TextField
                                    value={webmail}
                                    required
                                    onChange={(e) => setWebmail(e.target.value)}
                                    label="webmail" className='w-75'
                                    variant='standard' />
                                {/* end email input  */}


                                {/* password input  */}
                                <TextField
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    label="password" type={checked ? "text" : "password"}
                                    className='w-75 my-3' variant='standard' />
                                {/* end password input  */}


                                {/* show password  */}
                                <Box className="d-flex w-75 my-3 align-items-center justify-content-between">

                                    <div className='d-flex align-items-center'>

                                        <input checked={checked} onChange={(e) => setChecked(e.currentTarget.checked)} type='checkbox' />

                                        <Typography sx={{ mx: 1 }}>Show password</Typography>

                                    </div>

                                    <Typography role="button" onClick={() => setOpen(true)} className='text-secondary'>Forgot password?</Typography>

                                </Box>
                                {/* end show password  */}

                                {/* submit btn  */}
                                <Button
                                    disabled={error}
                                    className="w-75 mt-3 text-light"
                                    color={"secondary"} onClick={handleSubmit}
                                    variant='contained' endIcon={<ArrowRight />}>
                                    {user.loading ? <CircularProgress className='text-light' size={25} /> : 'Logn in'}
                                </Button>
                                {/* end submit btn  */}

                                {/* error msg  */}
                                {
                                    user.error && <Alert severity='error' className="w-75 my-2">
                                        {user.error}
                                    </Alert>
                                }
                                {/* end error msg  */}




                                {/* sign up link  */}
                                <Typography
                                    className="mt-5"
                                    variant="subtitle1">
                                    Don't have an account,
                                    <Link color={"secondary"} role="button" onClick={() => navigate('/signup')}>
                                        Signup</Link>
                                </Typography>
                                {/* end sign up link  */}

                                {/* login in as supervisor  */}
                                <Typography
                                    sx={{ my: 2 }} role="button"
                                    onClick={() => navigate("/OTP")}
                                    color={"#2f7d48"}>
                                    <u>Continue as a supervisor</u>
                                </Typography>
                                {/* end login in as supervisor  */}
                            </Paper>
                        </Box>


                        {/* forgot password modal  */}

                        <Dialog open={open} >

                            <DialogContent sx={{ width: 450 }}>

                                <Box className="d-flex align-items-center justify-content-between w-100" >

                                    <Typography>Password reset</Typography>

                                    <IconButton onClick={() => setOpen(false)}>
                                        <Close />
                                    </IconButton>

                                </Box>

                                <Typography sx={{ mt: 2, mb: 3 }}>Please provide your webmail</Typography>

                                <TextField value={my_webmail} onChange={(e) => setMy_webmail(e.target.value)} fullWidth label="webmail" />

                                <Button

                                    onClick={resetPassword}

                                    disabled={resetting || !my_webmail}
                                    endIcon={<ArrowRight />} color='secondary' sx={{ mt: 3 }} variant='contained'>

                                    {

                                        resetting

                                            ?

                                            <CircularProgress size={14} />

                                            :

                                            <Typography textTransform={"lowercase"}>Confirm</Typography>

                                    }

                                </Button>

                            </DialogContent>

                        </Dialog>

                    </Container>
            }
        </>
    )
}

export default Login