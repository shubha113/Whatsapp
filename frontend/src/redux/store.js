import { configureStore } from '@reduxjs/toolkit'
import conversationsReducer from './conversationSlice/conversationSlice'
import messagesReducer from './messageSlice/messageSlice'

export const store = configureStore({
  reducer: {
    conversations: conversationsReducer,
    messages: messagesReducer,
  },
})