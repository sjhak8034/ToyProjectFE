export interface RoomListItem{
    roomId: number;
    roomName: string;
    roomType: string;
    ownerNickname: string;
    ownerId: number;
    currentPlayers: number;
    maxPlayers: number;
    roomStatus: string;
    isPrivate: boolean;
    isParticipated: boolean;
    isMine: boolean;
}