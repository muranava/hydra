/// <reference path="app.ts" />
/// <reference path="dom/DOM.ts" />
DOM.ready(() => {
    var app: Application = new Application({
        'contact.name': 'Kirill Sukhomlin',
        'contact.email': atob('eWFAa2lyaWxsb2lkLnJ1'),
        'contact.subject': 'Hydra tool'
    });
    app.run();
});
