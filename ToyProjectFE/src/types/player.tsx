export interface PlayerInfoListItem {
    playerId: number;
    nickname: string;
    playerType: 'AI' | 'USER';
    picture: string;
}