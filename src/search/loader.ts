/// <reference path="item.d.ts" />
module Search {
    export class Loader {
        private fnName: string = 'searchLoad';
        private path: string;
        private pattern: string;
        private page: number;
        private loading: boolean;
        private noMoreToLoad: boolean;
        constructor (path: string) {
            this.path = path;
            window[this.fnName] = this.searchLoad.bind(this);
        }
        public doSearch (value: string): void {
            if (!value) { return; }
            this.pattern = value;
            this.noMoreToLoad = false;
            this.page = 0;
            this.loadPage();
        }
        public loadPage (): void {
            if (this.loading) { return; }
            if (this.noMoreToLoad) { return; }
            var s: HTMLScriptElement = document.createElement('script');
            this.loading = true;
            s.src = this.path +
                '?pattern=' + encodeURIComponent(this.pattern) +
                '&callback=' + encodeURIComponent(this.fnName) +
                '&page=' + (++this.page);
            document.head.appendChild(s);
        }
        private searchLoad (results: SearchItem[]): void {
            this.loading = false;
            if (results.length < 25) {
                this.noMoreToLoad = true;
            }
            this.onResultsLoad(results);
        }
        public onResultsLoad(results: SearchItem[]): void {
        }
    }
}
