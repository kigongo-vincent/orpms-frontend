import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode'
const URL = "https://kigongovincent.pythonanywhere.com"






const savedUser = JSON.parse(localStorage.getItem("user"))
const initialState = {
    notifications: [],
    loading: savedUser ? false : savedUser?.loading,
    verifyingOTP: false,
    OTP_ERROR: "",
    getting_notifications: true,
    previousPage: "",
    has_group: !savedUser ? false : savedUser.has_group,
    error: "",
    notificationError: false,
    user_id: !savedUser ? null : savedUser.user_id,
    username: !savedUser ? null : savedUser.username,
    email: !savedUser ? null : savedUser.email,
    photo: !savedUser ? null : savedUser.photo,
    userType: !savedUser ? 'user' : savedUser.userType,
    isLoggedIn: !savedUser ? false : savedUser.isLoggedIn,
    searching: false,
    searchResults: [],
    tokens: {
        access: !savedUser ? null : savedUser.tokens.access,
        refresh: !savedUser ? null : savedUser.tokens.refresh
    }
}


// ===============================function for getting notifications from the server==========
export const getNotifications = createAsyncThunk("auth/getNotifications", async (user_id) => {
    const response = await fetch(`${URL}/notifications/${user_id ? user_id : 0}`)
    return await response.json()
})

export const addNotifications = createAsyncThunk("auth/addNotifications", async (data) => {
    const response = await fetch(`${URL}/notifications/${data ? data.reciever : 0}`, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await response.json()
})

export const addExternalNotifications = createAsyncThunk("auth/addExternalNotifications", async (data) => {
    const response = await fetch(`${URL}/external_notifications/`, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await response.json()
})


// ===============================function for viewing notifications from the server==========
export const viewNotifications = createAsyncThunk("auth/viewNotifications", async (user_id) => {
    const response = await fetch(`${URL}/notification/${user_id ? user_id : 0}`)
    return await response.json()
})


// ===============================function for searching for projects from the server==========
export const Searching = createAsyncThunk("auth/Searching", async (q) => {
    const response = await fetch(`${URL}/search/${q ? q : ''}`)
    return await response.json()
})

// ===============================function for authenticating a user ==========
export const loginUser = createAsyncThunk("auth/loginUser", async (credentials) => {
    const response = await fetch(`${URL}/token/`, {
        method: "POST",
        body: credentials
    })
    return {
        data: await response.json(),
        status: response.status
    }
})


// ===============================function for verifying a user's OTP==========
export const loginWithOtp = createAsyncThunk("auth/loginWithOtp", async (OTP) => {
    const response = await fetch(`${URL}/verify`, {
        method: "POST",
        body: JSON.stringify({ OTP: OTP }),
        headers: {
            "Content-type": "application/json"
        }
    })
    return {
        data: await response.json(),
        status: response.status
    }
})

export const authSlice = createSlice({
    name: "auth-slice",
    initialState,
    reducers: {
        update_dp: (state, action) => {
            state.photo = action.payload
        },
        reset_error: (state) => {
            state.OTP_ERROR = ""
        },
        format: (state) => {
            state.email = null
            state.has_group = null
            state.isLoggedIn = false
            state.loading = false
            state.notifications = []
            state.photo = null
            state.searchResults = []
            state.searching = false
            state.tokens = null
            state.userType = "user"
            state.user_id = null
            state.username = null
        },
        savePath: (state, action) => {
            state.previousPage = action.payload
        },
        update_has_group: (state) => {
            state.has_group = true
            let this_user = JSON.parse(localStorage.getItem("user"))
            this_user.has_group = true
            localStorage.setItem("user", JSON.stringify(this_user))
        },
        OTP_SIGNIN: (state, action) => {
            let user = action?.payload?.user

            state.user_id = user?.user_id

            state.isLoggedIn = true,

                state.userType = user?.role

            state.tokens = {
                access: action?.payload?.access,
                refresh: action?.payload?.refresh
            }

            state.email = user?.email

            state.has_group = user?.has_group

            state.photo = `${URL}${user?.photo_url}`

            let fullName = user?.email?.split('@')[0]

            let firtsName = fullName.split('.')[0]

            let lastName = fullName.split('.')[1]

            state.username = `${firtsName} ${lastName}`

            localStorage.setItem("user", JSON.stringify(state))
        }
    },

    extraReducers(builder) {

        // ============================logging in ================================
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(loginWithOtp.pending, (state) => {
            state.verifyingOTP = true
        })
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false

            if (action.payload.status != 200) {
                state.error = "Login failed. please verify your webmail or password and try again"
            } else {
                state.error = ""
                let account = jwtDecode(action.payload.data.access)
                state.user_id = account.user_id
                state.isLoggedIn = true,
                    state.userType = account.role
                state.tokens = action.payload.data
                state.email = account.email
                state.has_group = account.has_group
                state.photo = `${URL}${account.photo_url}`
                let fullName = account.email.split('@')[0]
                let firtsName = fullName.split('.')[0]
                let lastName = fullName.split('.')[1]
                state.username = `${firtsName} ${lastName}`
                localStorage.setItem("user", JSON.stringify(state))
            }

        })
        builder.addCase(loginWithOtp.fulfilled, (state, action) => {


            if (action.payload.status != 200) {
                state.OTP_ERROR = "user account not found"
            } else {
                let account = jwtDecode(action.payload.data.access)
                let user = action.payload.data.user
                state.user_id = account.user_id
                state.isLoggedIn = true,
                    state.userType = user.role
                state.tokens = {
                    access: action.payload.data.access,
                    refresh: action.payload.data.refresh
                }
                state.email = user.email
                state.has_group = user.has_group
                state.photo = ``
                let fullName = user.email.split('@')[0]
                let firtsName = fullName.split('.')[0]
                let lastName = fullName.split('.')[1]
                state.username = `${firtsName} ${lastName}`
                localStorage.setItem("user", JSON.stringify(state))
                state.verifyingOTP = false
            }

        })
        builder.addCase(loginUser.rejected, (state) => {
            state.loading = false,
                state.error = "something went wrong"
        })
        builder.addCase(loginWithOtp.rejected, (state) => {
            state.verifyingOTP = false,
                state.OTP_ERROR = "invalid code, try again"
        })

        // =======================notifications ==========================
        builder.addCase(getNotifications.pending, (state) => {
            state.getting_notifications = true
        })
        builder.addCase(getNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload
            state.notificationError = false
            state.getting_notifications = false
        })
        builder.addCase(getNotifications.rejected, (state) => {
            state.getting_notifications = false
            state.notificationError = true

        })
        builder.addCase(viewNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload
        })
        builder.addCase(addNotifications.fulfilled, (state, action) => {
            if (action.payload != 0) {
                state.notifications = action.payload
            }
        })

        //    ========================searching======================= 
        builder.addCase(Searching.pending, (state) => {
            state.searching = true
        })
        builder.addCase(Searching.fulfilled, (state, action) => {
            state.searching = false
            state.searchResults = action.payload
        })
    }
})

export const getAuthInformation = (state) => state.auth
export const { format, update_dp, OTP_SIGNIN, reset_error, savePath, update_has_group } = authSlice.actions
export default authSlice.reducer