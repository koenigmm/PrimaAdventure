"use strict";
var PrimaAdventure;
(function (PrimaAdventure) {
    // import ƒ = FudgeCore;
    class Enemy extends PrimaAdventure.Floor {
        constructor(_colorValueCSS = "red", _scaling = 0.5) {
            super(_colorValueCSS);
            this.healthpoints = 100;
            this.demage = 10;
            this.cmpTransform.local.scaling = new ƒ.Vector3(_scaling, _scaling, _scaling);
        }
    }
    PrimaAdventure.Enemy = Enemy;
})(PrimaAdventure || (PrimaAdventure = {}));
//# sourceMappingURL=Enemy.js.map