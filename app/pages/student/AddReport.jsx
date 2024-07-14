import React, { useEffect, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { Button, Container, Autocomplete, Alert, IconButton, Box, TextField, Typography, Paper, CircularProgress, InputLabel } from '@mui/material'
import { FileCopy, Send, Close } from '@material-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTopics, getTopics } from '../../../src/model/slices/ProjectsReducer'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getAuthInformation } from '../../../src/model/slices/AuthReducer'
import { addNotifications, addExternalNotifications } from '../../../src/model/slices/AuthReducer'


const AddReport = () => {
  const { id } = useParams()
  const user = useSelector(getAuthInformation)
  const [error, setError] = useState(false)
  const [topic, setTopic] = useState("")
  const [title, setTitle] = useState("")
  const [abstract, setAbstract] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const topics = useSelector(getAllTopics)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const addReport = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("topic", getTopicId(topic))
    formData.append("abstract", abstract)
    formData.append("report", file)
    formData.append("group", +(id))

    const response = await fetch(`https://kigongovincent.pythonanywhere.com/add_project/`, {
      method: "POST",
      body: formData
    })

    if (response.status == 201) {
      const data = await response.json()
      dispatch(addNotifications({
        reciever: user.user_id,
        severity: "warning",
        message: `You have uploaded a new report, (${data.title})`
      }))

      JSON.parse(localStorage.getItem("data")).members.forEach(member => {
        if (member != user.user_id) {
          dispatch(addExternalNotifications({
            reciever: member,
            severity: "warning",
            message: `A new report has been uploaded by ${user.username} to your group, check it out from your dashboard`
          }))
        }
      })
      navigate(`/group/${user.user_id}`)
    } else {
      setError(true)
    }

    setLoading(false)
  }

  const getTopicId = (topic_name) => {
    let foundTopic = topics.find(topic => topic.name == topic_name)
    return foundTopic ? foundTopic.id : 0
  }



  useEffect(() => {
    dispatch(getTopics())
  }, [])

  const HiddenInput = () => {
    return (
      <input type='file' className='d-none' accept='.pdf' onChange={(e) => setFile(e.currentTarget.files[0])} />
    )
  }

  return (
    <>
      {
        !user.isLoggedIn || user.userType != "student"
          ?
          <Navigate to={"/"} />
          :
          <div>
            <UserNavigation />
            <Container sx={{ mt: 10 }} maxWidth="md">
              <Paper elevation={0} sx={{ p: 3 }}>
                <Typography sx={{ mb: 3 }}>Add a report</Typography>
                <TextField value={title} onChange={(e) => setTitle(e.target.value)} label="Title for the report" className="w-100" sx={{ mb: 3 }} />
                <Autocomplete title="topics" label="" className="w-100 mb-3" variant="filled" value={topic} onChange={(_, value) => setTopic(value)} options={topics && topics.map(topic => topic.name)} renderInput={(params) => <TextField {...params} />} />
                <TextField value={abstract} onChange={(e) => setAbstract(e.target.value)} multiline rows={5} variant="outlined" label="Project description" className="w-100" sx={{ mb: 3 }} />
                <br />
                <Button startIcon={<FileCopy />}>
                  <InputLabel >
                    upload report (PDF)
                    <HiddenInput />
                  </InputLabel>
                </Button>

                {
                  file &&
                  <Alert severity='info' className='w-100 mt-4'>
                    you have selected {file.name}
                  </Alert>
                }
                <br />
                <Button className='text-light' onClick={addReport} variant="contained" color="secondary" endIcon={<Send />} sx={{ mt: 3 }}>
                  {
                    loading ?
                      <CircularProgress size={15} className="text-light" />
                      :
                      "save progress"
                  }

                </Button>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <div>
                    {
                      error
                      && <Alert severity='error' action={<IconButton onClick={() => setError(false)}>
                        <Close />
                      </IconButton>}>
                        <Typography variant='caption'>something went wrong</Typography>


                      </Alert>
                    }
                  </div>
                  <span className='shadow-sm p-3 mt-4 rounded'>
                    2 of 2
                  </span>
                </Box>
              </Paper>
            </Container>
          </div>
      }
    </>
  )
}

export default AddReport