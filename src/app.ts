/// <reference path="search/view.ts" />
/// <reference path="search/form.ts" />
/// <reference path="search/infinite.ts" />
/// <reference path="search/loader.ts" />
/// <reference path="youtube/player.ts" />
class Application {
    private view: Search.View;
    private loader: Search.Loader;
    private player: YouTube.Player;
    private infinite: Search.InfiniteHelper;
    private searchForm: Search.Form;
    public config: any;
    constructor (cfg: any) {
        this.config = cfg;
        this.initComponents();
        this.bindComponents();
        this.exportFunctions();
    }
    public playInterval (key: string, start: number, duration: number): void {
        this.player.playInterval(key, start, duration);
    }
    protected initComponents (): void {
        this.view = new Search.View(DOM.q('#results'));
        this.searchForm = new Search.Form(<HTMLFormElement>DOM.q('#search'));
        this.infinite = new Search.InfiniteHelper();
        this.loader = new Search.Loader(this.config['search.endpoint']);
        this.player = new YouTube.Player('player');
        (<HTMLAnchorElement>DOM.q('#feedback')).href =
            'mailto:"' + this.config['contact.name'] + '"' +
            '<' + this.config['contact.email'] + '>' +
            '?subject=' + this.config['contact.subject'];
    }
    protected bindComponents (): void {
        this.loader.onResultsLoad = (results) => {
            this.view.addResults(results);
        }
        this.infinite.onEdge = () => {
            this.loader.loadPage();
        }
        this.searchForm.onSearch = this.search.bind(this);
    }
    protected exportFunctions (): void {
        var global = <any> window;
        global.playInterval = this.playInterval.bind(this);
        var m: RegExpMatchArray = location.search.match(/^\?pattern=([^&]+)/);
        if (m) {
            this.searchForm.setValue(decodeURIComponent(m[1]));
        }
    }
    protected search (pattern: string): void {
        this.view.newSearch(pattern);
        this.loader.doSearch(pattern);
        history.pushState(null, "Search: " + pattern, "?pattern=" + encodeURIComponent(pattern));
    }
    public run(): void {
        this.search(this.searchForm.getValue());
    }
}
