"use strict";
var PrimaAdventure;
(function (PrimaAdventure) {
    var ƒ = FudgeCore;
    class Healthpotion extends PrimaAdventure.Floor {
        constructor(_value = 40, _scaling) {
            super("fuchsia");
            this.scaling = 0.5;
            this.value = _value;
            this.cmpTransform.local.scaling = new ƒ.Vector3(this.scaling, this.scaling, this.scaling);
        }
    }
    PrimaAdventure.Healthpotion = Healthpotion;
})(PrimaAdventure || (PrimaAdventure = {}));
//# sourceMappingURL=HealthPotion.js.map