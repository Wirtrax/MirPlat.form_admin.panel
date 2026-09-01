import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AttemptStatistic } from './attemptStatisticType';
import { getAttempts } from '../../api';

interface AttemptStatisticState {
  data: AttemptStatistic;
  loading: boolean;
  error: string | null;
}

const initialState: AttemptStatisticState = {
  data: {
    waitingAttempts: 0,
  },
  loading: false,
  error: null,
};

export const fetchAttemptStatistic = createAsyncThunk('statistic/fetchAttempt', async (_, { rejectWithValue }) => {
  try {
    const attemptsData = await getAttempts();

    const statistic: AttemptStatistic = {
      waitingAttempts: attemptsData.filter((attepmt) => attepmt.attemptStatus == 'waiting').length,
    };

    return statistic;
  } catch (error) {
    return rejectWithValue('Ошибка при загрузке статистике');
  }
});

const attemptStatisticSlice = createSlice({
  name: 'attemptStatistic',
  initialState,
  reducers: {
    resetStatistic: (state) => {
      state.data = initialState.data;
      state.error = initialState.error;
    },
    decreaseWaitingAttempts: (state) => {
      state.data.waitingAttempts = Math.max(0, state.data.waitingAttempts - 1);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAttemptStatistic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttemptStatistic.fulfilled, (state, action) => {
        state.loading = false;
        state.data.waitingAttempts = action.payload.waitingAttempts;
      })
      .addCase(fetchAttemptStatistic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetStatistic, decreaseWaitingAttempts } = attemptStatisticSlice.actions;
export default attemptStatisticSlice.reducer;
