import { createSlice } from "@reduxjs/toolkit";

const responseSlice = createSlice({
    name: 'response',
    initialState:'Draw something for the AI to analyze!',
    reducers: {
        updateResponse: (state,action) => {
            return action.payload
        }
    }
})

export const {updateResponse} = responseSlice.actions
export default responseSlice.reducer