import { useEffect, useState } from 'react'
import { ArrowForward, ArrowRight, ArrowBack, Close } from '@material-ui/icons'
import Logo from '../../src/assets/svgs/muk.svg'
import { Box, Container, Paper, Button, TextField, Typography, Link, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, LinearProgress } from '@mui/material'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAuthInformation, loginUser, loginWithOtp, reset_error } from '../../src/model/slices/AuthReducer'
import { verifyPassword } from '../utilities/passwordCheck'
const Signup = () => {
    const [webmail, setWebmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(true)

    const user = useSelector(getAuthInformation)

    const [resend, setResend] = useState(false)

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const [your_mail, set_your_mail] = useState("")

    const [sending, setSending] = useState(false)

    const [isVisble, setIsVisible] = useState(false)

    const [code, setCode] = useState('')

    const [accountError, setAccountError] = useState('')

    const [verificationCode, setVerificationCode] = useState('')

    const [res, setRes] = useState(200)

    const [vcode, setVcode] = useState("")

    const resendCode = async () => {
        setSending(true)
        const response = await fetch(`https://kigongovincent.pythonanywhere.com/resend/${your_mail}`)
        if (response.status == 201) {
            setRes(201)
            // setResend(false)
            setSending(false)
        }
        else {
            setRes(403)
            setSending(false)
        }
    }

    const [checked, setChecked] = useState(false)


    const handleSubmit = async () => {
        setLoading(true)


        const response = await fetch(`https://kigongovincent.pythonanywhere.com/signup/`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: webmail,
                password: password1
            })
        })

        if (response.status == 201) {
            const data = await response.json()

            setVcode(data.OTP)
            await fetch(`https://kigongovincent.pythonanywhere.com/notifications/${data.id}`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    reciever: data.id,
                    message: "Your account was created successfully",
                    severity: "success"
                })
            })
            setLoading(false)
            setIsVisible(true)
        }
        else if (response.status == 406) {
            setAccountError(`${webmail} already exists, please sign in or create an account using another webmail`)
            setLoading(false)
        }
        else {
            setAccountError("Something went wrong, try again")
            setLoading(false)
        }
        setLoading(false)



        // setVerificationCode(vcode)
        // if (vcode) {
        //     setIsVisible(true)
        // }
        // else {
        //     setAccountError('Something went wrong, try again')
        // }
        // setLoading(false)
    }

    const verifyCode = () => {
        if (code == vcode) {
            navigate('/')
        }
        else {
            setIsVisible(false)
            setAccountError('you provided the wrong passCode')
        }
    }

    function isFormValid() {
        if (webmail.includes('@students.mak.ac.ug') || webmail.includes('@cit.mak.ac.ug')) {
            if (password1.length < 3 && password2.length < 3) {
                setError(true)
            }
            else {
                if (password1 == password2) {
                    setError(!verifyPassword(password1))
                }
                else {
                    setError(true)
                }
            }
        } else {
            setError(true)
        }
    }



    useEffect(() => isFormValid(), [webmail, password1, password2])
    return (
        <>
            {
                user.isLoggedIn ? <Navigate to="/" /> : <Container maxWidth="sm">
                    <Box sx={{ height: '100vh' }} display="flex" flexDirection={'column'} alignItems={'center'} justifyContent={"center"}>
                        <Paper elevation={0} className='p-5 d-flex align-items-center flex-column'>
                            <img src={Logo} width="80%" alt="" className='mb-4' />
                            <Typography sx={{ px: 10 }} variant='caption' className='text-secondary' textAlign={"center"}>

                                <Typography role="button" variant='caption' color={"secondary"} onClick={() => setIsVisible(true)}>verify your account</Typography>
                            </Typography>
                            <TextField value={webmail} required onChange={(e) => setWebmail(e.target.value)} label="webmail" helperText="(use your campus webmail)" className='w-100' variant='standard' />
                            <TextField type={checked ? "text" : "password"} helperText="password must contain a special character, lowercase & uppercase characters and numbers" value={password1} required onChange={(e) => setPassword1(e.target.value)} label="password" className='w-100 my-3' variant='standard' />
                            <TextField type={checked ? "text" : "password"} value={password2} required onChange={(e) => setPassword2(e.target.value)} label="password confirmation" className='w-100 my-3' variant='standard' />
                            <Box display={"flex"} className=" w-100" justifySelf={"flex-start"} alignItems={"center"}>
                                <input checked={checked} onChange={(e) => setChecked(e.currentTarget.checked)} type='checkbox' />
                                <Typography sx={{ mx: 1 }}>Show passwords</Typography>
                            </Box>
                            <Button disabled={error} onClick={handleSubmit} color="secondary" variant="contained" className="align-self-end text-light" endIcon={<ArrowRight />}>
                                {loading ? <CircularProgress className='text-light' size={25} /> : 'Signup'}
                            </Button>
                            {
                                accountError && <Alert action={<IconButton onClick={() => setAccountError(false)}>
                                    <Close />
                                </IconButton>} severity='error' className="w-100 my-2">
                                    {accountError}
                                </Alert>
                            }
                            <Typography className="mt-5" variant="subtitle1" role="button" onClick={() => navigate('/login')}>Already have an account, <Link color={"secondary"}>Signin</Link></Typography>

                        </Paper>
                    </Box>
                    <Dialog open={isVisble} sx={{ zIndex: 4 }} >
                        <DialogTitle>
                            <div className="d-flex align-items-center justify-content-between"><Typography variant="h5" sx={{ mr: 10 }}>Verify your Email</Typography> <IconButton onClick={() => setIsVisible(false)}><Close /></IconButton></div>
                            <Typography sx={{ my: 3 }}>
                                An OTP (One time password) <u className="text-success">has been</u> or <u className="text-danger">was</u> sent to the email you specified when signing in, please check your email for the code and fill it in the text box below to activate your account.
                            </Typography>
                        </DialogTitle>
                        <DialogContent >
                            <TextField onFocus={() => dispatch(reset_error())} label="verification code" value={code} onChange={(e) => setCode(e.target.value)} type="text" variant="filled" fullWidth />
                            <Typography sx={{ mt: 2 }}>
                                Didn't recieve code, <u role='button' className='text-danger' onClick={() => setResend(true)}>Resend</u>
                            </Typography>
                            {
                                user.OTP_ERROR ?
                                    <Alert severity='error' className='mt-5 mb-2'>
                                        {user.OTP_ERROR}
                                    </Alert> : ""
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => dispatch(loginWithOtp(code))} disabled={code.length != 6}>Continue</Button>

                        </DialogActions>


                        {
                            user.verifyingOTP && <LinearProgress color='secondary' />
                        }
                    </Dialog>
                    <Dialog open={resend}>
                        <DialogTitle>
                            <div className="d-flex align-items-center justify-content-between"><Typography variant="h5" sx={{ mr: 10 }}>Didn't get email</Typography> <IconButton onClick={() => setResend(false)}><Close /></IconButton></div>
                            <Typography sx={{ my: 3 }}>
                                Please provide your webmail used for signing up.
                            </Typography>
                        </DialogTitle>
                        <DialogContent >
                            <TextField disabled={res == 201} onFocus={() => setRes(200)} label="webmail" value={your_mail} onChange={(e) => set_your_mail(e.target.value)} type="text" variant="filled" fullWidth />
                            {
                                res != 200 ?
                                    <Alert severity={res == 201 ? "success" : "error"} className='mt-5 mb-2'>
                                        {res == 201 ? "OTP sent successfully" : "something went wrong try again"}
                                    </Alert> : ""
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button disabled={your_mail.length < 10} onClick={resendCode}>Continue</Button>

                        </DialogActions>


                        {
                            sending && <LinearProgress color='secondary' />
                        }
                    </Dialog>
                </Container>
            }
        </>
    )
}

export default Signup