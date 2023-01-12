import { createSlice } from '@reduxjs/toolkit';

const visibleSlice = createSlice({
  name: 'visible',
  initialState: false,
  reducers: {
    updateVisible: (state, action) => action.payload,
  },
});

export const { updateVisible } = visibleSlice.actions;
export default visibleSlice.reducer;
