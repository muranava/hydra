module Search {
    export class Form {
        private form: HTMLFormElement;
        constructor (form: HTMLFormElement) {
            this.form = form;
            form.onsubmit = (event: Event) => {
                event.preventDefault();
                this.onSearch(this.getValue());
            };
        }
        protected getSearchInput(): HTMLInputElement {
            return <HTMLInputElement>(<any>this.form).pattern;
        }
        public getValue (): string {
            return this.getSearchInput().value;
        }
        public setValue (value: string): void {
            this.getSearchInput().value = value;
        }
        public onSearch (pattern: string): void {
        }
    }
}
