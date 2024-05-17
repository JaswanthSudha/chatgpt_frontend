import { useEffect, useState } from 'react';
import { CiChat1 } from 'react-icons/ci';
import { MdPerson } from 'react-icons/md';
import useChat from './hooks/useChat';
export default function App() {
	const [input, setInput] = useState('');
	const { dispatch, chats } = useChat();
	const [History, setHistory] = useState([]);
	useEffect(() => {
		const items = JSON.parse(localStorage.getItem('history'));
		if (items) {
			setHistory(items);
		} else {
			setHistory([]);
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const value = input;
		setHistory([{ message: value }, ...History]);
		localStorage.setItem('history', JSON.stringify(History));
		setInput('');
		dispatch({
			type: 'SET_USERCHAT',
			payload: { user: 'me', message: `${value}` },
		});

		try {
			const response = await fetch('/data', {
				method: 'POST',
				body: JSON.stringify({ input: `${value}` }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const json = await response.json();
			if (json) {
				dispatch({
					type: 'SET_GPTCHAT',
					payload: { user: 'gpt', message: `${json.message}` },
				});
			}

			// const copy = chatLog.slice();
		} catch (error) {
			dispatch({
				type: 'SET_GPTCHAT',
				payload: { user: 'gpt', message: `${error}` },
			});
		}
	};

	return (
		<div className='h-screen flex w-screen'>
			<aside
				style={{
					backgroundColor: '#202123',
					width: 300,
					padding: 20,
				}}
				className='text-white h-full bg-white '>
				<div
					className='border-2 rounded-lg p-2 hover:bg-slate-500'
					onClick={() => {
						dispatch({
							type: 'CLEAR_CHAT',
						});
					}}>
					<span className='mr-10'>+</span>
					New Chat
				</div>
				<div className='p-10'>
					<h1 className='text-2xl font-serif shadow-md shadow-stone-600 p-2'>
						History
					</h1>
					{History.map((his, index) => {
						return (
							<div
								className='mt-2 mb-2 text-xl'
								key={index}>
								{his.message.substring(0, 10)}...
							</div>
						);
					})}
					<div
						onClick={() => {
							localStorage.setItem('history', JSON.stringify([]));
							setHistory([]);
						}}
						className='border-gray-500 border-2 p-2 rounded-lg hover:bg-slate-500 '
						style={{
							position: 'absolute',
							bottom: 100,
							left: 50,
						}}>
						Clear History
					</div>
				</div>
			</aside>
			<div
				style={{
					backgroundColor: '#343541',
					overflowY: 'auto',
				}}
				className='h-full w-full text-white '>
				<div className='p-20'>
					{chats.map((chat, index) => {
						return (
							<div
								style={{
									margin: 10,
									padding: 10,
								}}
								key={index}
								className={`${
									chat.user === 'me'
										? 'chat-message'
										: 'bg-slate-500 rounded-md'
								}`}>
								{/* <div
									className={`${
										chat.user === 'me' ? 'avater' : 'avater chatgpt'
									}`}></div> */}
								{chat.user === 'me' ? (
									<MdPerson
										style={{
											height: 50,
											width: 50,
										}}
									/>
								) : (
									<CiChat1 className='text-2xl ' />
								)}
								<div
									style={{
										marginLeft: 30,
									}}
									className={`message`}>
									{chat.message}
								</div>
							</div>
						);
					})}
				</div>
				<div
					style={{
						position: 'absolute',
						bottom: 20,
						right: 20,
						left: 70,
					}}
					className='w-full ml-10 mr-10 mt-5 '>
					<form onSubmit={handleSubmit}>
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							style={{
								outline: 'none',
								width: 1240,
								backgroundColor: '#40414f',
							}}
							className='p-3 rounded-md text-white'
							type='text'
							placeholder='prompt Here'
						/>
					</form>
				</div>
			</div>
		</div>
	);
}
