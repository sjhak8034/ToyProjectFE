import { use, useState, useEffect } from "react";
import api from "../api/auth";
import type { PlayerInfoListItem } from "../types/player";


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

    useEffect(() => {
        // Fetch player list data from API or other source
        const fetchPlayerList = async () => {
            const response = await api.get("/players/rooms/3");
            setPlayerList(response.data);
        };

        fetchPlayerList();
    }, []);

    return (
        <div className="drawer drawer-end">
            <input id="player-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
            </div>
            <div className="drawer-side">
                <label htmlFor="player-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <span>
                        현재 참여중인 채팅방
                    </span>
                    {/* Sidebar content here */}
                    {playerList.map((player) => (
                        <li key={player.playerId} className="flex-row gap-2">
                             <img src={player.picture} alt={player.nickname} className="size-8 rounded-full object-cover" />
                            <a>{player.nickname}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

