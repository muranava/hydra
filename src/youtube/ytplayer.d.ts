declare module YT {
    interface Player {
        loadVideoById(videoId: string, startSeconds: number, suggestedQuality: string): void;
        loadVideoById(params: {
            videoId: string;
            startSeconds: number;
            endSeconds: number;
            suggestedQuality: string
        }): void;
        playVideo(): void;
        pauseVideo(): void;
        stopVideo(): void;
        seekTo(seconds: number, allowSeekAhead: boolean): void;
        getPlayerState(): PlayerState;
        getCurrentTime(): number;
        addEventListener(event: string, listener: string): void;
        removeEventListener(event: string, listener: string): void;
    }
    enum PlayerState {
        UNSTARTED = -1,
        ENDED = 0, PLAYING, PAUSED, BUFFERING, VIDEO_CUED
    }
}
declare var onYouTubePlayerReady: (playerId: string) => void;
