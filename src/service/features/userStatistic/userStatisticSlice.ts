import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { UserStatistic } from './userStatisticType';
import { getUsers } from '../../api';

interface UserStatisticState {
  data: UserStatistic;
  loading: boolean;
  error: string | null;
}

const initialState: UserStatisticState = {
  data: {
    totalUser: 0,
  },
  loading: false,
  error: null,
};

export const fetchUserStatistic = createAsyncThunk('statistic/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const userData = await getUsers();

    const statistic: UserStatistic = {
      totalUser: userData.length,
    };

    return statistic;
  } catch (error) {
    return rejectWithValue('Ошибка при загрузке статистике');
  }
});

const userStatisticSlice = createSlice({
  name: 'userStatistic',
  initialState,
  reducers: {
    resetStatistic: (state) => {
      state.data = initialState.data;
      state.error = initialState.error;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserStatistic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatistic.fulfilled, (state, action) => {
        state.loading = false;
        state.data.totalUser = action.payload.totalUser;
      })
      .addCase(fetchUserStatistic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetStatistic } = userStatisticSlice.actions;
export default userStatisticSlice.reducer;
