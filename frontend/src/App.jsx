import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from './redux/conversationSlice/conversationSlice';
import Sidebar from './components/sidebar/Sidebar';
import ChatArea from './components/chatArea/ChatArea';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { activeConversation } = useSelector(state => state.conversations);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  return (
    <div className="app">
      <div className={`app-body ${activeConversation ? 'chat-active' : ''}`}>
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  );
}

export default App;