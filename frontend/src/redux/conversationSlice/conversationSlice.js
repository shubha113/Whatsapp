import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api/v1'

// Async thunk to fetch all conversations
export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/message/conversations`)
      return response.data.conversations
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)


const conversationsSlice = createSlice({
  name: 'conversations',
  initialState: {
    conversations: [],
    activeConversation: null,
    loading: false,
    error: null,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload
    },
    clearActiveConversation: (state) => {
      state.activeConversation = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false
        state.conversations = action.payload
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setActiveConversation, clearActiveConversation } = conversationsSlice.actions
export default conversationsSlice.reducer