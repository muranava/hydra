/// <reference path="DOM.ts" />
/// <reference path="stack.ts" />
module DOM {
    export class Token {
        m: RegExpExecArray;
        static re: RegExp = /(?:)/;
        getRe (): RegExp { return Token.re; }
        constructor (str: string, idx: number) {
            var re: RegExp = this.getRe();
            re.lastIndex = idx;
            var a = re.exec(str);
            this.m = a && a.index === idx ? a : null;
        }
        build (stack: DOMStack) {}
        getName(): string { return this.m[1]; }
        getValue(): string { return this.m[2]; }
        static subs = [];
        static match (str: string, idx: number): Token {
            var i: number,
                len: number = this.subs.length,
                token: Token;
            for (i = 0; i < len; i++) {
                token = new this.subs[i](str, idx);
                if (token.m !== null) { return token; }
            }
            return null;
        }
    }

    class WhiteSpaceToken extends Token {
        static re: RegExp = /\s+/g;
        getRe (): RegExp { return WhiteSpaceToken.re; }
        build (stack: DOMStack) {}
    }
    Token.subs.push(WhiteSpaceToken);

    class TagToken extends Token {
        static re: RegExp = /(h[1-6]|[a-z]+)/g;
        getRe (): RegExp { return TagToken.re; }
        build (stack: DOMStack) {
            var item = document.createElement(this.getName());
            stack.append(item);
        }
    }
    Token.subs.push(TagToken);

    class TagCloseToken extends Token {
        static re: RegExp = /\//g;
        getRe (): RegExp { return TagCloseToken.re; }
        build (stack: DOMStack) {
            stack.fold();
        }
    }
    Token.subs.push(TagCloseToken);

    class HTMLToken extends Token {
        static re: RegExp = /(& )(.*)(?:\n|$)/g;
        getRe (): RegExp { return HTMLToken.re; }
        build (stack: DOMStack) {
            stack.getTop().insertAdjacentHTML('beforeend', this.getValue());
        }
    }
    Token.subs.push(HTMLToken);

    class ClassToken extends Token {
        static re: RegExp = /\.([a-z_-]+)/ig;
        getRe (): RegExp { return ClassToken.re; }
        build (stack: DOMStack) {
            stack.getTop().classList.add(this.getName());
        }
    }
    Token.subs.push(ClassToken);

    class IdToken extends Token {
        static re: RegExp = /#([a-z_-]+)/ig;
        getRe (): RegExp { return IdToken.re; }
        build (stack: DOMStack) {
            stack.getTop().id = this.getName();
        }
    }
    Token.subs.push(IdToken);

    class AttrToken extends Token {
        static re: RegExp = /@([\w-]+)=([^ ]+)/g;
        getRe (): RegExp { return AttrToken.re; }
        build (stack: DOMStack) {
           stack.getTop().setAttribute(this.getName(), this.getValue());
        }
    }
    Token.subs.push(AttrToken);

    export function tokenize (str) {
        var i: number = 0,
            token: Token,
            out: Token[] = [];
        do {
            token = Token.match(str, i);
            if (!token) { throw new SyntaxError("Unexpected substring " + str.substr(i, 10)); }
            out.push(token);
            i = token.getRe().lastIndex;
            if (i === str.length) break;
        } while (i > 0);
        return out;
    };
}
