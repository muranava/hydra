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
    constructor () {
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
        this.loader = new Search.Loader('search.php');
        this.player = new YouTube.Player('player');
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
//        global.searchLoad = 
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
