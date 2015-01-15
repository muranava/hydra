/// <reference path="swfobject.d.ts" />
/// <reference path="ytplayer.d.ts" />
module YouTube {
    export class Player {
        private loaded: boolean;
//         get loaded(): boolean { return this.loaded; }
        private key: string = null;
        private player: YT.Player;
        private playerId: string;
        private timerId: number;
        private videoLoadCallback: () => void;
        constructor (id: string) {
            this.playerId = id;
        }
        private loadVideo (key: string, start: number, callback: () => void): void {
            this.videoLoadCallback = callback;
            this.player.loadVideoById(key, start, 'default');
        }
        private loadPlayer (key: string, callback: () => void): void {
            this.key = key;
            onYouTubePlayerReady = (id) => {
                this.player = <YT.Player><any>swfobject.getObjectById(id);
                this.player.addEventListener('onStateChange', 'execVideoLoadCallback');
                (<any>window).execVideoLoadCallback = this.execVideoLoadCallback;
                callback();
            };
            swfobject.embedSWF(
                "http://www.youtube.com/v/" + key + "?enablejsapi=1&playerapiid=ytplayer&version=3",
                "player", "480", "290", "8", null, null,
                { allowScriptAccess: "always" },
                { id: this.playerId },
                () => { this.loaded = true; }
            );
        }
        private execVideoLoadCallback (state: YT.PlayerState): void {
            if (state === YT.PlayerState.VIDEO_CUED) {
                this.videoLoadCallback();
            }
        }
        private playActual (start: number, duration: number): void {
            window.clearInterval(this.timerId);
            this.player.seekTo(start, true);
            this.player.playVideo();
            var end: number = start + duration;
            this.timerId = setInterval(() => {
                if (this.player.getCurrentTime() > end) {
                    this.player.stopVideo();
                    window.clearInterval(this.timerId);
                }
            }, 200);
        }
        public playInterval (key: string, start: number, duration: number): void {
            if (!this.loaded) {
                this.loadPlayer(key, () => {
                    this.playActual(start, duration);
                });
            } else if (key !== this.key) {
                this.key = key;
                this.loadVideo(key, start, () => {
                    this.playActual(start, duration);
                });
            } else {
                this.playActual(start, duration);
            }
        }
    }
}
