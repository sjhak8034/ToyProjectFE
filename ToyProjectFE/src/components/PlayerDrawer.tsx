import { useState, useEffect } from "react";
import api from "../api/auth";
import type { PlayerInfoListItem } from "../types/player";
import { useLocation } from "react-router-dom";


export function PlayerDrawerToggleButton({ className = "" }: { className?: string }) {
    return (
        <label htmlFor="player-drawer" className={`btn btn-white drawer-button ${className}`}>
            <img
                src="/images/players_button.svg"
                alt="Menu"
                className="w-6 h-6" // Tailwind: 24x24px
            // style={{ width: 24, height: 24 }} // 직접 스타일 지정도 가능
            />
        </label>
    );
}



export default function PlayerDrawer() {
    const [playerList, setPlayerList] = useState<PlayerInfoListItem[]>([]);
    // GroupRoomPage로부터 roomId를 prop으로 받아야 합니다.
    const roomId = useLocation().pathname.split("/").pop() || ""; // 현재 URL에서 roomId 추출

    useEffect(() => {
        if (!roomId) {
            return; // roomId가 없으면 아무 작업도 하지 않음
        }
        // Fetch player list data from API or other source
        const fetchPlayerList = async () => {
            const response = await api.get(`/players/rooms/${roomId}`); // roomId는 현재 채팅방의 ID로 대체해야 합니다.
            setPlayerList(response.data);
        };

        fetchPlayerList();
    }, [roomId]);

    return (
        <div className="drawer drawer-end">
            <input id="player-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
            </div>
            <div className="drawer-side">
                <label htmlFor="player-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className=" bg-base-200 text-base-content min-h-full w-80 p-4">
                    <span>
                        현재 참여중인 채팅방 인원
                    </span>
                    {/* Sidebar content here */}
                    {playerList.map((player) => (
                        <li key={player.playerId} className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded">
                             <img src={player.picture} alt={player.nickname} className="size-6 rounded-full object-cover" />
                            <a>{player.nickname}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

