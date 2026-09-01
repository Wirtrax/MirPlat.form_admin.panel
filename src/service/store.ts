import { combineReducers, configureStore } from '@reduxjs/toolkit';
import superAdminReducer from './features/superAdmin/superAdminSlice';
import userStatisticReducer from './features/userStatistic/userStatisticSlice';
import itemStatisticReducer from './features/itemStatistic/itemStatisticSlice';
import orderStatisticReducer from './features/orderStatistic/orderStatisticSlice';
import attemptStatisticReducer from './features/attemptStatistic/attemptStatisticSlice';

const rootReducer = combineReducers({
  superAdmin: superAdminReducer,
  userStatistic: userStatisticReducer,
  itemStatistic: itemStatisticReducer,
  orderStatistic: orderStatisticReducer,
  attemptStatistic: attemptStatisticReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

type StoreType = ReturnType<typeof setupStore>;
export type RootState = ReturnType<StoreType['getState']>;
export type AppDispatch = StoreType['dispatch'];
