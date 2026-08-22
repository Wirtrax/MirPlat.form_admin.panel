import { combineReducers, configureStore } from '@reduxjs/toolkit';
import superAdminReducer from './features/superAdmin/superAdminSlice';

const rootReducer = combineReducers({
  superAdmin: superAdminReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

type StoreType = ReturnType<typeof setupStore>;
export type RootState = ReturnType<StoreType['getState']>;
export type AppDispatch = StoreType['dispatch'];
