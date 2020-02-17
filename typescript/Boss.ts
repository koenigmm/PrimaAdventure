namespace PrimaAdventure {
    export class Boss extends Enemy {
        public defeated: boolean = false;
        public constructor(_colorValueCSS: string = "crimson", _scaling: number = 0.75) {
            super(_colorValueCSS, _scaling);
            this.healthpoints = 120;
        }
    }
}