import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
    name: 'image',
    initialState: "",
    reducers: {
        updateImage: (state,action) => {
            return action.payload
        }
    }
})

export const {updateImage} = imageSlice.actions
export default imageSlice.reducer