import { useRef, useEffect, useState, use } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/auth';
import { createWebSocketClient } from '../websocket/WebSocketClient';
import { type UserProfileResponseDto } from '../api/users';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

interface ChatLogResponse {
    id: number;
    message: string;
    userId: number;
    senderNickname: string;
    createdAt: string;
    isMine: boolean;
}

export const GroupRoomPage = () => {

    const { roomId } = useParams();

    const [startChatId, setStartChatId] = useState<number>(Number.MAX_SAFE_INTEGER); // 시작 채팅 ID, 초기값은 MAX_SAFE_INTEGER
    const [isEnd, setIsEnd] = useState(false); // 채팅 로그가 끝났는지 여부
    const [chatLogs, setChatLogs] = useState<ChatLogResponse[]>([]); // 채팅 로그 
    const [page, setPage] = useState(0); // 현재 페이지
    const [size, setSize] = useState(100); // 페이지당 개수
    const prevChatLogsLengthRef = useRef<number>(0);// 이전 채팅 로그 길이
    const newChatLogsLengthRef = useRef<number>(0);// 새로운 채팅 로그 길이
    const [connected, setConnected] = useState(false);// 웹소켓 연결 상태
    const wsRef = useRef<any>(null);// 웹소켓 클라이언트
    const prevLast = useRef<number>(0);// 마지막 채팅 ID를 저장하는 ref
    const textareaRef = useRef<HTMLTextAreaElement>(null);// 채팅 입력창 참조
    const chatContainerRef = useRef<HTMLFieldSetElement>(null);// 채팅 컨테이너 참조


    // 사용자 정보 가져오기
    const user = useSelector<RootState, UserProfileResponseDto | null>(
        (state) => state.user
    );

    // websocket 연결 새로운 메시지 수신
    useEffect(() => {
        wsRef.current = createWebSocketClient(
            `/topic/rooms/${roomId}`,
            {
                onConnect: () => setConnected(true),
                onMessage: (msg) => {
                    // 기존 chatLogs에 새 메시지 추가
                    let newLog: ChatLogResponse;
                    console.log('새 메시지 수신:', msg);
                    console.log('user:', user?.id);
                    try {
                        const parsed = typeof msg === 'string' ? JSON.parse(msg) : msg;
                        newLog = {
                            id: parsed.id ?? Date.now(),
                            message: parsed.message,
                            userId: parsed.userId,
                            senderNickname: parsed.senderNickname ?? '알 수 없음',
                            createdAt: parsed.createdAt ?? new Date().toISOString(),
                            isMine: parsed.userId === user?.id,
                        };
                    } catch {
                        newLog = {
                            id: Date.now(),
                            message: String(msg),
                            userId: user?.id ?? 0,
                            senderNickname: '알 수 없음',
                            createdAt: new Date().toISOString(),
                            isMine: false,
                        };
                    }
                    setChatLogs(prev => [...prev, newLog]); // 여기만 추가!
                },
                onError: (err) => console.error(err),
                onStompError: (frame) => console.error(frame),
            }
        );
        wsRef.current.activate();

        return () => {
            wsRef.current.deactivate();
        };
    }, [user, roomId]);


    // 플레이어 조회 및 생성
    useEffect(() => {
        const createPlayer = async () => {
            try {
                const response = await api.get(`/players/users/exists/rooms/${roomId}`);
                console.log('플레이어 조회 완료:', response.data);
                if (response.data) {
                    console.log('플레이어가 이미 존재합니다.');
                    // 이미 존재하면 아무 것도 하지 않음
                } else {
                    console.log('플레이어가 존재하지 않습니다. 생성합니다.');
                    await api.post('/players/users/rooms/' + roomId);
                    console.log('플레이어 생성 완료');
                }
            } catch (error) {
                console.error('플레이어 조회/생성 실패:', error);
                // window.location.href = '/';
            }
        };
        createPlayer();
    }, [roomId]);

    // 채팅 로그 조회
    useEffect(() => {
        console.log('채팅 로그 조회:', roomId, page, size, startChatId);
        if (!isEnd) {
            api.get(`/user-chats/rooms/${roomId}/chats?page=${page}&size=${size}&startId=${startChatId}`)
                .then(response => {
                    let logs = Array.isArray(response.data)
                        ? response.data
                        : (response.data.content || []);
                    logs = [...logs].reverse(); // 최신 채팅이 아래로 오도록 역순 정렬
                    if (page === 0) {
                        setStartChatId(logs[logs.length - 1]?.id); // 첫 페이지의 시작 ID 설정
                        setChatLogs(logs); // 최초 조회는 덮어쓰기
                    } else {
                        setChatLogs(prev => [...logs, ...prev]); // 이전 페이지는 앞에 합치기
                    }
                    if (logs.length < size) {
                        setIsEnd(true); // 더 이상 채팅 로그가 없으면 isEnd를 true로 설정
                    } else {
                        setIsEnd(false);
                    }
                    console.log('채팅 로그 조회 성공:', logs);
                });
        }
    }, [roomId, page, size]);


    // 채팅 입력창 자동 줄바꿈 및 높이 조절
    // connected가 true여야지 렌더링 시작됨
    useEffect(() => {
        if (!connected) return; // 연결 안 됐으면 아무것도 하지 않음

        const textarea = textareaRef.current;
        console.log('textarea:', textarea);
        if (!textarea) return;

        const handleInput = () => {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${Math.min(scrollHeight, 160)}px`;
        };

        textarea.addEventListener('input', handleInput);

        return () => {
            textarea.removeEventListener('input', handleInput);
        };
    }, [connected]);

    // Modify your React handleKeyDown to include height adjustment
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendChat();
        }
    };

    // 다음 페이지 로드 핸들러
    const handleNextPage = () => {
        if (isEnd) return; // 더 이상 페이지가 없으면 중단
        setPage((prev) => prev + 1);
    };

    // 스크롤 이벤트 핸들러 꼭대기에서 다음 페이지 로드
    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            // 스크롤이 chatContainerRef의 맨 위에 도달했을 때 다음 페이지 로드
            if (container.scrollTop === 0) {
                handleNextPage();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [chatContainerRef, handleNextPage]);

    // 채팅 전송 핸들러
    const handleSendChat = () => {
        if (!textareaRef.current) return;
        const value = textareaRef.current.value.trim();
        if (value) {
            // 웹소켓을 통해 채팅 메시지 전송 그리고 백엔드에서 로그 저장
            wsRef.current.publish(
                `/app/rooms/${roomId}`,
                { message: value }
            );
            // 여기에 실제 채팅 전송 로직 추가
            console.log('채팅 전송:', value);
            textareaRef.current.value = '';
            textareaRef.current.style.height = 'auto';
        }

    };


    // 채팅 로그가 변경될 때마다 스크롤 위치 조정
    useEffect(() => {
        const container = chatContainerRef.current;
        newChatLogsLengthRef.current = chatLogs.length;
        if (!container || chatLogs.length === 0) return;

        // 1. 첫 페이지 로드 시(최초)만 맨 아래로
        if (page === 0) {
            container.scrollTop = container.scrollHeight;
            prevLast.current = chatLogs[chatLogs.length - 1]?.id || 0;
            prevChatLogsLengthRef.current = chatLogs.length;
            return;
        }

        // 2. 새 채팅이 추가된 경우(맨 뒤 id가 바뀐 경우)만 맨 아래로
        const isNewChatAdded =
            chatLogs[chatLogs.length - 1]?.id !== prevLast.current &&
            chatLogs.length > prevChatLogsLengthRef.current;

        if (isNewChatAdded) {
            container.scrollTop = container.scrollHeight;
        } else {
            // 3. 이전 페이지(과거 채팅) 로드 시에는 비례 조정만
            container.scrollTop =
                container.scrollHeight *
                (1 - (prevChatLogsLengthRef.current || 0) / (newChatLogsLengthRef.current || 1));
        }

        prevLast.current = chatLogs[chatLogs.length - 1]?.id || 0;
        prevChatLogsLengthRef.current = chatLogs.length;
    }, [chatLogs, page]);

    // 최초 로드 시 채팅 컨테이너 스크롤 위치 조정
    useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, []); // 의존성 배열이 []이므로 최초 1회만 실행

    if (!connected) {
        // 연결이 되지 않았을 때 로딩 화면이나 메시지를 보여줄 수 있습니다.
        return <div>Websocket Connecting...</div>;
    }

    if (!user) return <div>사용자 정보를 불러오는중</div>; // user 정보가 없으면 연결하지 않음

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <fieldset
                ref={chatContainerRef}
                className="fieldset bg-base-200 border-base-300 rounded-box w-1/2 h-2/3 border p-4 overflow-y-auto"
            >
                <legend className="fieldset-legend">Page title</legend>
                <div className="chat-container">
                    {/* chatLogs가 배열이 아닐 수 있는 경우를 방지 */}
                    {Array.isArray(chatLogs) && chatLogs.length > 0 ? (
                        chatLogs.map((log) => (
                            log.isMine ? myChat(log) : otherChat(log)
                        ))
                    ) : (
                        <div className="text-gray-400 text-center py-8">채팅 내역이 없습니다.</div>
                    )}
                </div>
            </fieldset>
            <style>
                {`
                .chat-bubble {
                    max-width: 40%;
                    width: fit-content;
                    word-break: break-word;
                    white-space: pre-line;
                    padding: 0.75rem 1rem;
                    border-radius: 1rem;
                    background-color: var(--tw-bg-opacity, #f3f4f6);
                    margin-bottom: 0.5rem;
                }
            `}
            </style>
            <textarea
                ref={textareaRef}
                id="myTextarea"
                className="textarea textarea-bordered w-1/2 min-h-[40px] max-h-40 resize-none focus:outline-none mt-2"
                rows={2}
                placeholder=""
                onKeyDown={handleKeyDown}
            />
            <button
                className="btn btn-primary mt-2"
                onClick={handleSendChat}
            >
                전송
            </button>
        </div>

    )
}
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // padStart로 항상 두 자리로 맞춤
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const myChat = (chat: ChatLogResponse) => (
    <div className="chat chat-end">
        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                />
            </div>
        </div>
        <div className="chat-header">
            {chat.senderNickname}
            <time className="text-xs opacity-50">{formatDate(chat.createdAt)}</time>
        </div>
        <div className="chat-bubble">{chat.message}</div>
    </div>
);

const otherChat = (chat: ChatLogResponse) => (
    <div className="chat chat-start">
        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                />
            </div>
        </div>
        <div className="chat-header">
            {chat.senderNickname}
            <time className="text-xs opacity-50">{formatDate(chat.createdAt)}</time>
        </div>
        <div className="chat-bubble">{chat.message}</div>
    </div>
);