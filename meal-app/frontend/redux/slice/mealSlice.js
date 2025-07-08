import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API URL
const API_URL = "http://localhost:5000/meals";

// Yemekleri getirme
export const fetchMeals = createAsyncThunk("meals/fetchMeals", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

// Favori toggle
export const toggleFavorite = createAsyncThunk(
  "meals/toggleFavorite",
  async (mealId, { getState }) => {
    const { token, user } = getState().auth;

    const response = await axios.patch(
      `http://192.168.196.80:5000/meals/${mealId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; 
  }
);

const mealSlice = createSlice({
  name: "meals",
  initialState: {
    meals: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.meals = action.payload;
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default mealSlice.reducer;
