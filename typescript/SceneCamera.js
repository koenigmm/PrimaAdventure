"use strict";
var PrimaAdventure;
(function (PrimaAdventure) {
    var ƒ = FudgeCore;
    class SceneCamera {
        //private tranform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
        constructor(distance, backgroundColor) {
            this.cmpCamera = new ƒ.ComponentCamera();
            this.distance = distance;
            this.cmpCamera.backgroundColor = backgroundColor;
            //this.cmpCamera.pivot.translation = new ƒ.Vector3(0, 0, distance);
            this.cmpCamera.pivot.translateZ(distance);
            this.cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        }
        get componentCamera() {
            return this.cmpCamera;
        }
    }
    PrimaAdventure.SceneCamera = SceneCamera;
})(PrimaAdventure || (PrimaAdventure = {}));
//# sourceMappingURL=SceneCamera.js.map