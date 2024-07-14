
import { Box, Container, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'

import UserNavigation from '../../components/UserNavigation'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { getRelativeTime } from '../../utilities/getRelativeTime'

import { Send } from '@material-ui/icons'
import { useSelector } from 'react-redux'
import { getAuthInformation } from '../../../src/model/slices/AuthReducer'

const Messages = () => {

  const user = useSelector(getAuthInformation)

  const [messages, setMessages] = useState([])

  const [message, setMessage] = useState("")

  const scroll = useRef()

  useLayoutEffect(() => {

    if (scroll.current) {

      scroll.current.scrollTop = scroll.current.scrollHeight - scroll.current.clientHeight

    }
  }, [scroll.current, messages, message])


  const sendMessage = (e) => {

    fetch(`https://kigongovincent.pythonanywhere.com/broadcast`, {

      method: "POST",

      headers: {

        "Content-type": "application/json"

      },

      body: JSON.stringify({

        author: user?.user_id,

        body: message

      })

    })

    e.preventDefault()

    const now = new Date()

    const new_message = {

      id: messages?.length + 1,

      body: message,

      time: now?.toISOString()

    }

    setMessages([...messages, new_message])

    setMessage("")

  }

  const get_broadcasts = async () => {

    const response = await fetch(`https://kigongovincent.pythonanywhere.com/get_broadcast/${user?.user_id}`)

    if (response?.status == 200) {

      const data = await response.json()

      setMessages(data)

    }

  }


  useEffect(() => {

    get_broadcasts()

  }, [])

  return (
    <div>

      <UserNavigation />

      <Container sx={{ mt: 11 }}>

        <Paper elevation={0} sx={{ height: "80vh", p: 3 }}>

          <Typography variant='h4' sx={{ px: 2 }} fontWeight={"bold"}>Broadcasts</Typography>

          <Typography sx={{ mt: 1, mb: 2, px: 2 }}>These are messages that you have sent to all groups on the platform</Typography>

          <div ref={scroll} className="d-flex flex-column align-items-start p-4" style={{ paddingTop: 2, overflowY: "scroll", height: "50vh" }}>


            {/* messages loop  */}


            {

              messages?.map(message => (

                // message component 

                <Box key={message?.id} className="bg-body-tertiary p-4 mb-3" borderRadius={4} minWidth={200} display={"flex"} flexDirection={"column"}>

                  <Typography>{message?.body}</Typography>

                  <br />

                  <Typography alignSelf={"flex-end"} variant='caption'>{getRelativeTime(message?.time)}</Typography>

                </Box>

              ))

            }

          </div>

          {/* compose message  */}

          <form className='w-40 px-4' onSubmit={sendMessage}>

            <TextField
              // disabled={project.approved || project.status == "approved"}

              fullWidth

              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              InputProps={
                {
                  endAdornment: (
                    <InputAdornment>
                      <IconButton onClick={sendMessage}>
                        <Send className='text-success' />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              } label="send message" />

          </form>

        </Paper>

      </Container>

    </div>
  )
}

export default Messages