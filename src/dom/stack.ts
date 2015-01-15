/// <reference path="DOM.ts" />
module DOM {
    export class DOMStack {
        private stack: HTMLElement[];
        private top: HTMLElement;
        private root: Node;
        constructor () {
            this.stack = [];
            this.root = document.createDocumentFragment();
        }
        private getInnerTop (): Node {
            return this.top || this.root;
        }
        append (el: HTMLElement) {
            this.getInnerTop().appendChild(el);
            this.stack.push(this.top = el);
        }
        getTop (): HTMLElement {
            return this.top;
        }
        fold (): HTMLElement {
            this.stack.pop();
            return (this.top = this.stack.slice(-1)[0]);
        }
        foldTop (): HTMLElement {
            while (this.stack.length > 1) {
                this.fold();
            }
            return this.top;
        }
    }
}
