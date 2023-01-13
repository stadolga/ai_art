import { configureStore } from '@reduxjs/toolkit';
import response from './reducers/responseReducer';
import visible from './reducers/visibleReducer';
import image from './reducers/imageReducer';

const store = configureStore({
  reducer: {
    response,
    visible,
    image
  },
});

export default store;
