import React, { useEffect, useLayoutEffect, useState } from 'react'
import UserNavigation from '../../components/UserNavigation'
import { Autocomplete, Button, IconButton, Container, Box, TextField, Typography, CircularProgress, Alert, Paper } from '@mui/material'
import { Send, Close, TrendingUpTwoTone } from '@material-ui/icons'
import { FaPlus } from 'react-icons/fa'
import { getName } from '../../utilities/getName'
import { useDispatch, useSelector } from 'react-redux'
import { addExternalNotifications, addNotifications, getAuthInformation, update_has_group } from '../../../src/model/slices/AuthReducer'
import { Navigate, useNavigate } from 'react-router-dom'
import { getAllCourses, getCourses } from '../../../src/model/slices/ProjectsReducer'

const AddProject = () => {
  const [superVisors, setSupervisors] = useState([])
  const [superVisor, setSupervisor] = useState([])
  const [students, setStudents] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [course, setCourse] = useState("")

  const courses = useSelector(getAllCourses)

  const [academicYears, setAcademicYears] = useState([])

  const [academicYear, setAcademicYear] = useState("")

  const getDeadlines = () => {
    let deadlines = JSON.parse(localStorage.getItem("deadlines"))
    if (deadlines.length != 0) {
      setAcademicYears(deadlines.map(deadline => deadline.academic_year))
    }
  }

  useLayoutEffect(() => {
    getDeadlines()
  }, [])

  const user = useSelector(getAuthInformation)

  const getSupervisors = async () => {
    const response = await fetch("https://kigongovincent.pythonanywhere.com/supervisors")
    if (response.status == 200) {
      const data = await response.json()
      setSupervisors(data.filter(s => s.number_of_groups < 3))
    }
  }

  const navigate = useNavigate()



  const getStudents = async () => {
    const response = await fetch("https://kigongovincent.pythonanywhere.com/students")
    if (response.status == 200) {
      const data = await response.json()
      setStudents(data)
    }
  }

  const getSupervisorId = (name) => {
    if (superVisor) {
      const s = superVisors.find(supervisor => getName(supervisor.email) == name)
      return s ? s.id : 0
    }
  }
  const getStudentId = (name) => {
    const s = students.find(student => getName(student.email) == name)
    return s ? s.id : 0
  }

  const getStudentIds = (students_array) => {
    const studentIds = students_array.map(student => getStudentId(student))
    setMembers(studentIds)
  }
  const dispatch = useDispatch()



  const addGroup = async () => {

    if (members.length > 4) {

      alert("Group cannot have more than 5 members")

      return

    }

    setLoading(true)


    const new_group = {
      supervisor: superVisor,
      leader: user.user_id,
      members: [...members, user.user_id],
      academic_year: academicYear,
      course: courses?.find(this_course => this_course.name == course)?.id
    }


    const response = await fetch("https://kigongovincent.pythonanywhere.com/add_group/", {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(new_group)
    })
    if (response.status == 201) {
      const data = await response.json()
      for (let i = 0; i < data.members.length; i++) {
        await fetch("https://kigongovincent.pythonanywhere.com/add_grade/", {
          method: "POST",
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            student: data.members[i],
            group: data.id
          })
        })
      }
      dispatch(addNotifications({
        reciever: user.user_id,
        severity: "success",
        message: `You have created a new group, (${data.name})`
      }))

      data.members.forEach(member => {
        if (member != user.user_id) {
          dispatch(addExternalNotifications({
            reciever: member,
            severity: "success",
            message: `you have been added to a new group (${data.name}) by ${user.username}`
          }))
        }
      })

      dispatch(addExternalNotifications({
        reciever: data.supervisor,
        severity: "warning",
        message: `you have been added to a new group (${data.name}) by ${user.username}. Your assistance and guidance would be of high value to this group`
      }))
      dispatch(update_has_group())
      navigate(`/group/${user.user_id}`)
    }
    else {
      setError(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    getSupervisors()
    getStudents()
    dispatch(getCourses())
  }, [])


  return (
    <>
      {
        !user.isLoggedIn
          ?
          <Navigate to={"/"} />
          :
          user.userType != "student" && !user.has_group
            ?
            <Navigate to={"/"} />
            :
            user.has_group == true
              ?
              <Navigate to={`/group/${user.user_id}`} />
              :
              <div>
                <UserNavigation />
                <Container sx={{ mt: 10 }} maxWidth="sm">
                  <Paper elevation={0} sx={{ p: 3 }}>
                    <u><Typography sx={{ mb: 2 }}>Create your group</Typography></u>

                    <Autocomplete value={course} onChange={(_, value) => setCourse(value)} sx={{ mb: 2 }} options={courses?.map(course => course.name)} renderInput={(params) => <TextField label="Course" {...params} />} />

                    <Autocomplete value={academicYear} onChange={(_, value) => setAcademicYear(value)} sx={{ mb: 2 }} options={academicYears} renderInput={(params) => <TextField label="Academic year" {...params} />} />


                    <Autocomplete onChange={(_, value) => setSupervisor(getSupervisorId(value))} title="supervisor" label="Supervisor" className="w-100 mb-3" variant="filled" options={superVisors.map(supervisor => getName(supervisor.email))} renderInput={(params) => <TextField {...params} label="Supervisor" />} />

                    <Alert severity='info' sx={{ my: 1 }}>
                      <Typography variant='subtitle1'>
                        Only students who have signed up on this system are eligible for selection as group members
                      </Typography>
                    </Alert>

                    <Autocomplete onChange={(_, new_array) => {
                      getStudentIds(new_array)
                    }} multiple className="w-100 mb-3" variant="filled" options={students.map(student => student.email != user.email && getName(student.email))} limitTags={2} renderInput={(params) =>
                      <TextField label={"Group members"} {...params} />} />
                    <span>
                      <Button onClick={addGroup} sx={{ mt: 3 }} color="secondary" className='text-light' variant="contained" startIcon={!loading && <FaPlus size={15} />}>
                        {
                          loading ?
                            <CircularProgress size={15} className="text-light" />
                            :
                            "add group"
                        }
                      </Button>
                    </span>

                    <div>
                      {
                        error
                        && <Alert severity='error' sx={{ mt: 1 }} action={<IconButton onClick={() => setError(false)}>
                          <Close />
                        </IconButton>}>
                          <Typography variant='caption'>
                            something went wrong
                          </Typography>


                        </Alert>
                      }
                    </div>

                  </Paper>
                </Container>
              </div>
      }
    </>
  )
}

export default AddProject