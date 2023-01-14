import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
  name: 'error',
  initialState: '',
  reducers: {
    updateError: (state, action) => action.payload,
  },
});

export const { updateError } = errorSlice.actions;
export default errorSlice.reducer;
