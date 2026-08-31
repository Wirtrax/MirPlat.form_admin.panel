import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { OrderStatistic } from './orderStatisticType';
import { getOrders } from '../../api';

interface OrderStatisticState {
  data: OrderStatistic;
  loading: boolean;
  error: string | null;
}

const initialState: OrderStatisticState = {
  data: {
    waitingOrder: 0,
  },
  loading: false,
  error: null,
};

export const fetchOrderStatistic = createAsyncThunk('statistic/fetchOrder', async (_, { rejectWithValue }) => {
  try {
    const ordersData = await getOrders();

    const statistic: OrderStatistic = {
      waitingOrder: ordersData.filter((order) => order.status == 'waiting').length,
    };

    return statistic;
  } catch (error) {
    return rejectWithValue('Ошибка при загрузке статистике');
  }
});

const orderStatisticSlice = createSlice({
  name: 'orderStatistic',
  initialState,
  reducers: {
    resetStatistic: (state) => {
      state.data = initialState.data;
      state.error = initialState.error;
    },
    increaseWaitingOrder: (state) => {
      state.data.waitingOrder += 1;
    },
    decreaseWaitingOrder: (state) => {
      state.data.waitingOrder = Math.max(0, state.data.waitingOrder - 1);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrderStatistic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatistic.fulfilled, (state, action) => {
        state.loading = false;
        state.data.waitingOrder = action.payload.waitingOrder;
      })
      .addCase(fetchOrderStatistic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetStatistic, increaseWaitingOrder, decreaseWaitingOrder } = orderStatisticSlice.actions;
export default orderStatisticSlice.reducer;
