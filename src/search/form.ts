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
        public getValue (): string {
            var input = <HTMLInputElement>(<any>this.form).pattern;
            return input.value;
        }
        public onSearch (pattern: string): void {
        }
    }
}
