import { createSlice } from '@reduxjs/toolkit';

const stateSlice = createSlice({
  name: 'state',
  initialState: '',
  reducers: {
    updateState: (state, action) => action.payload,
  },
});

export const { updateState } = stateSlice.actions;
export default stateSlice.reducer;
