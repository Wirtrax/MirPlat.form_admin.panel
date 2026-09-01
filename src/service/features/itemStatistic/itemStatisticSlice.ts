import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { ItemStatistic } from './itemStatisticType';
import { getItems } from '../../api';

interface ItemStatisticState {
  data: ItemStatistic;
  loading: boolean;
  error: string | null;
}

const initialState: ItemStatisticState = {
  data: {
    totalItem: 0,
  },
  loading: false,
  error: null,
};

export const fetchItemStatistic = createAsyncThunk('statistic/fetchItem', async (_, { rejectWithValue }) => {
  try {
    const itemsData = await getItems();

    const statistic: ItemStatistic = {
      totalItem: itemsData.length,
    };

    return statistic;
  } catch (error) {
    return rejectWithValue('Ошибка при загрузке статистике');
  }
});

const itemStatisticSlice = createSlice({
  name: 'itemStatistic',
  initialState,
  reducers: {
    resetStatistic: (state) => {
      state.data = initialState.data;
      state.error = initialState.error;
    },
    increaseTotalItem: (state) => {
      state.data.totalItem += 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchItemStatistic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemStatistic.fulfilled, (state, action) => {
        state.loading = false;
        state.data.totalItem = action.payload.totalItem;
      })
      .addCase(fetchItemStatistic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetStatistic, increaseTotalItem } = itemStatisticSlice.actions;
export default itemStatisticSlice.reducer;
