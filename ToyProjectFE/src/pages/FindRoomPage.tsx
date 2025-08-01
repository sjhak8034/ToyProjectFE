import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/auth';
import { type RoomListItem } from '../types/room';

export default function FindRoomPage() {
    const [roomList, setRoomList] = useState<RoomListItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch room list data from API or other source
        const fetchRoomList = async () => {
            try {
                const response = await api.get("/rooms?mine=false");
                setRoomList(response.data.content);
            } catch (error) {
                console.error("Failed to fetch room list:", error);
            }
        };

        fetchRoomList();
    }, []);

    return (
        <ul className="list bg-base-100 rounded-box shadow-md">
            {roomList.length === 0 ? (
                <li className="text-center p-4">No rooms available</li>
            ) : (
                roomList.map((room: RoomListItem) => (
                    <li className="list-row">
                        <div><img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" /></div>
                        <div>
                            <div>{room.roomName}</div>
                            <div className="text-xs uppercase font-semibold opacity-60">{room.currentPlayers}/{room.maxPlayers}</div>
                        </div>  
                        <button className="btn btn-square btn-ghost"
                            onClick={() => navigate(`/rooms/${room.roomId}`)}>
                            <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
                        </button>
                    </li>
                ))
            )}



        </ul>
    );
}