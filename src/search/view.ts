/// <reference path="../dom/DOM.ts" />
/// <reference path="loader.ts" />
/// <reference path="item.d.ts" />
module Search {
    export class View {
        private title: string;
        private author: string;
        private videoEl: HTMLElement;
        private channelEl: HTMLElement;
        private firstLoad: boolean;
        private wrapper: HTMLElement;
        private pattern: string;
        constructor (wrapper: HTMLElement) {
            this.wrapper = wrapper;
            DOM.delegate(this.wrapper, 'click', '.header', function (event) {
                var node = this;
                node.collapsed = !node.collapsed;
                node.parentNode.classList.toggle('collapsed');
                var cl = node.querySelector('.glyphicon').classList;
                cl.toggle('glyphicon-collapse-down');
                cl.toggle('glyphicon-expand');
            });
        }
        public newSearch (pattern: string): void {
            this.pattern = pattern;
            this.title = null;
            this.author = null;
            this.videoEl = null;
            this.channelEl = null;
            this.firstLoad = true;
        }
        private setAuthor (author: string): void {
            if (this.author === author) { return; }
            this.author = author;
            if (this.channelEl != null) {
                this.wrapper.appendChild(this.channelEl);
            }
            this.channelEl = DOM.el("div " +
                "h3.header span.label.label-default " +
                    "span.glyphicon.glyphicon-collapse-down@aria-hidden=true / " +
                    "& " + author);
        }
        private setVideo (title: string): void {
            if (this.title === title) { return; }
            this.title = title;
            this.videoEl = DOM.el('div.block h4.header ' +
                'span.glyphicon.glyphicon-collapse-down@aria-hidden=true / ' +
                "& " + DOM.esc(title));
            this.channelEl.appendChild(this.videoEl);
        }
        private addLine (item: SearchItem) {
            this.setAuthor(item.author);
            this.setVideo(item.title);
            var id: string = item.key + "/" + item.order,
                a = DOM.el(
                    'a',
                    {   onclick: 'playInterval("' + item.key + '",' + item.start + ',' + item.duration + ')',
                        id: id,
                        href: '#' + id
                    },
                    item.text.replace(
                        new RegExp(this.pattern),
                        "<mark>$&</mark>"
                    )
                );
            this.videoEl.appendChild(a);
            this.videoEl.appendChild(DOM.el('br'));
        }
        public addResults (results: SearchItem[]): void {
            var el: HTMLElement,
                hash: string = "";
            if (this.firstLoad) {
                this.wrapper.innerHTML = '';
                this.firstLoad = false;
            }
            results.forEach(this.addLine.bind(this));
            this.wrapper.appendChild(this.channelEl);
            if (this.firstLoad && hash) {
                el = DOM.q("*[id='" + hash + "']");
                if (el !== null) { el.scrollIntoView(); }
            }
        }
    }
}
