/// <reference path="DOM.ts" />
module DOM {
    export function matcherFactory (selector: string): (HTMLElement) => boolean {
        var m: RegExpMatchArray;
        m = selector.match(/^\.(\w+)$/);
        if (m) return (node) => node.classList.contains(m[1]);
        throw new TypeError("Matcher not implemented");
    }
}
