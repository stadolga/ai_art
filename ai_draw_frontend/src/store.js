import { configureStore } from '@reduxjs/toolkit';
import response from './reducers/responseReducer';
import visible from './reducers/visibleReducer';

const store = configureStore({
  reducer: {
    response,
    visible,
  },
});

export default store;
