import { configureStore } from '@reduxjs/toolkit';
import response from './reducers/responseReducer';
import visible from './reducers/visibleReducer';
import image from './reducers/imageReducer';
import error from './reducers/errorReducer';

const store = configureStore({
  reducer: {
    response,
    visible,
    image,
    error,
  },
});

export default store;
