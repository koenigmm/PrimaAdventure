namespace PrimaAdventure {
    // import ƒ = FudgeCore;

    export class Enemy extends Floor {
        public healthpoints: number = 100;
        public demage: number = 10;
        public constructor(_colorValueCSS: string = "red", _scaling: number = 0.5) {
            super(_colorValueCSS);
            this.cmpTransform.local.scaling = new ƒ.Vector3(_scaling, _scaling, _scaling);
        }
    }
}