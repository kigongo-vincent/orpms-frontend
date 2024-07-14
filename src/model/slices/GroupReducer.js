import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    name: "Group C",
    supervisor: "Dr. Hawa Nyende",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium obcaecati fuga incidunt aut similique. Temporibus rem, veritatis magni illum eaque eligendi provident deserunt neque, officiis quo tenetur culpa a mollitia."
    ,members:[
        'kigongo vincent', 'buwembo moses', 'Denis Ivy', 'Traversy media', 'ramzi@gmail.com'
    ],
    leader :"ramzi@gmail.com",
    messages:[
        {
            id: 1,
            user: {
                name: "Dr. Hawa Nyende",
                is_leader: true
            },
            body:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium obcaecati fuga incidunt a hey who is this not replying",
            attachment: {
                type: "image"
            },
            sent: "3 hours ago"
        },
        {
            id: 2,
            user: {
                name: "kiggongo vincent",
                
                is_leader: true
            },
            body:"hey who is this not replying",
            attachment: {
               
                type: "image"
            },
            sent: "3 hours ago"
        }
    ]
}

export const GroupSlice  = createSlice({
    name: "group slice",
    initialState,
    reducers:{

    }
})

export default GroupSlice.reducer

export const getGroup = (state)=> state.group