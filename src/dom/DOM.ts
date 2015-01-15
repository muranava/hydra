/// <reference path="stack.ts" />
/// <reference path="tokenizer.ts" />
/// <reference path="matcher.ts" />
module DOM {
    export function esc(str: string): string {
        return str
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/&/g, "&amp;");
    }
    export function q (arg: string): HTMLElement {
        return <HTMLElement>document.querySelector(arg);
    }
    export function Q (arg: string): NodeList {
        return document.querySelectorAll(arg);
    }
    export function el (line: string, attrs: Object = {}, html: string = ""): HTMLElement {
        var stack = new DOMStack(),
            item;
        tokenize(line).forEach(function (item) { item.build(stack); });
        item = stack.foldTop();
        Object.keys(attrs || {}).forEach((name) => {
            item.setAttribute(name, attrs[name]);
        });
        if (html !== "") {
            item.insertAdjacentHTML('beforeend', html);
        }
        return item;
    }
    export function on (
        el: Element,
        eventType: string,
        callback: (Event) => void
    ) {
        el.addEventListener(eventType, callback, false);
    }
    export function delegate (
        el: Element,
        eventType: string,
        selector: string,
        callback: (Event) => void
    ) {
        var matcher: (HTMLElement) => boolean = matcherFactory(selector);
        el.addEventListener(eventType, (event: Event) => {
            var node = <HTMLElement>event.target;
            while (node !== el) {
                if (matcher(node)) break;
                node = <HTMLElement>node.parentNode;
            }
            if (node !== el) { callback.call(node, event); }
        }, false);
    }
    export function ready (callback: (event?: Event) => void): void {
        document.addEventListener('DOMContentLoaded', callback, false);
    }
}
