import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api/v1'

// Async thunk to fetch messages for a conversation
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (waId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/message/conversation/${waId}`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

// CORRECTED: Send message to the right endpoint
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ waId, messageBody, userName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/message/send`, {
        waId,
        messageBody,
        userName
      })
      return response.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    currentMessages: [],
    currentConversationInfo: null,
    loading: false,
    error: null,
    sendingMessage: false,
  },
  reducers: {
    clearMessages: (state) => {
      state.currentMessages = []
      state.currentConversationInfo = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.currentMessages = action.payload.messages
        state.currentConversationInfo = {
          waId: action.payload.waId,
          userName: action.payload.userName
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false
        state.currentMessages.push(action.payload)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false
        state.error = action.payload
      })
  },
})

export const { clearMessages, addOptimisticMessage } = messagesSlice.actions
export default messagesSlice.reducer