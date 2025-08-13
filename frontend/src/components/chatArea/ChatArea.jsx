import { useSelector } from 'react-redux';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import WelcomeScreen from './WelcomeScreen';
import './ChatArea.css';

const ChatArea = () => {
  const { activeConversation } = useSelector(state => state.conversations);

  if (!activeConversation) {
    return <WelcomeScreen />;
  }

  return (
    <div className="chat">
      <div className="chat-area-background"></div>
      <ChatHeader />
      <ChatBody />
    </div>
  );
};

export default ChatArea;