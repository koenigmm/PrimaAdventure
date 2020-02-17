"use strict";
var PrimaAdventure;
(function (PrimaAdventure) {
    class Boss extends PrimaAdventure.Enemy {
        constructor(_colorValueCSS = "crimson", _scaling = 0.75) {
            super(_colorValueCSS, _scaling);
            this.defeated = false;
            this.healthpoints = 120;
        }
    }
    PrimaAdventure.Boss = Boss;
})(PrimaAdventure || (PrimaAdventure = {}));
//# sourceMappingURL=Boss.js.map