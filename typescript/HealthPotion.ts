namespace PrimaAdventure {
    import ƒ = FudgeCore;

    export class Healthpotion extends Floor {
        public value: number;
        private scaling: number = 0.5;

        public constructor(_value: number = 40, _scaling?: number) {
            super("fuchsia");
            this.value = _value;
            this.cmpTransform.local.scaling = new ƒ.Vector3(this.scaling, this.scaling, this.scaling);
        }
    }
}