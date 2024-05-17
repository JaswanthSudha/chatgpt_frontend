import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
const useChat = () => {
	const context = useContext(ChatContext);
	return context;
};
export default useChat;
