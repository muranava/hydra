/// <reference path="../dom/DOM.ts" />
module Search {
    export class InfiniteHelper {
        constructor () {
            DOM.ready(() => {
                var b = document.body;
                window.onscroll = () => {
                    if (b.scrollHeight - (b.scrollTop + window.innerHeight) < 500) {
                        this.onEdge();
                    }
                };
            });
        }
        public onEdge () {
        }
    }
}
