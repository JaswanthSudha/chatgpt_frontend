import { createContext, useReducer } from 'react';
export const ChatContext = createContext();
const redFun = (state, action) => {
	switch (action.type) {
		case 'SET_USERCHAT':
			return {
				chats: [...state.chats, action.payload],
			};
		case 'SET_GPTCHAT': {
			return {
				chats: [...state.chats, action.payload],
			};
		}
		case 'CLEAR_CHAT': {
			return {
				chats: [],
			};
		}
	}
};
export const ChatContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(redFun, {
		chats: [],
	});

	return (
		<ChatContext.Provider
			value={{
				dispatch,
				...state,
			}}>
			{children}
		</ChatContext.Provider>
	);
};
