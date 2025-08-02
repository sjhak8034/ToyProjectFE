import { use, useState, useEffect } from "react";
import api from "../api/auth";
import { type RoomListItem } from "../types/room";


export function RoomDrawerToggleButton({ className = "" }: { className?: string }) {
    return (
        <label htmlFor="room-drawer" className={`btn btn-white drawer-button ${className}`}>
            <img
                src="/images/bubble-discussion.svg"
                alt="Menu"
                className="w-6 h-6" // Tailwind: 24x24px
            // style={{ width: 24, height: 24 }} // 직접 스타일 지정도 가능
            />
        </label>
    );
}



export default function RoomDrawer() {
    const [roomList, setRoomList] = useState<RoomListItem[]>([]);
    useEffect(() => {
        // Fetch room list data from API or other source
        const fetchRoomList = async () => {
            const response = await api.get("/rooms?mine=true");
            setRoomList(response.data.content);
        };

        fetchRoomList();
    }, []);

    return (
        <div className="drawer">
            <input id="room-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
            </div>
            <div className="drawer-side">
                <label htmlFor="room-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <span>
                        현재 참여중인 채팅방
                    </span>
                    {/* Sidebar content here */}
                    {roomList.map((room) => (
                        <li key={room.roomId}>
                            <a>{room.roomName}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

