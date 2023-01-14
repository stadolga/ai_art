import { createSlice } from '@reduxjs/toolkit';

const responseSlice = createSlice({
  name: 'response',
  initialState: 'Draw something for the AI to analyze!',
  reducers: {
    updateResponse: (state, action) => action.payload,
  },
});

export const { updateResponse } = responseSlice.actions;
export default responseSlice.reducer;
