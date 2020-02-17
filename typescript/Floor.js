"use strict";
var PrimaAdventure;
(function (PrimaAdventure) {
    var ƒ = FudgeCore;
    class Floor extends ƒ.Node {
        constructor(_colorValueCSS = "green") {
            super("Floor");
            this.rectEnabled = true;
            this.addComponent(new ƒ.ComponentTransform());
            this.material = new ƒ.Material("Floor", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS(_colorValueCSS, 0.75)));
            this.addComponent(new ƒ.ComponentMaterial(this.material));
            let cmpMesh = new ƒ.ComponentMesh(Floor.mesh);
            cmpMesh.pivot = Floor.pivot;
            this.addComponent(cmpMesh);
        }
        getRectWorld() {
            let rect = ƒ.Rectangle.GET(0, 0, 100, 100);
            let topleft = new ƒ.Vector3(-0.5, 0.5, 0);
            let bottomright = new ƒ.Vector3(0.5, -0.5, 0);
            // let topleft: ƒ.Vector3 = new ƒ.Vector3(-0.75, 0.75, 0);
            // let bottomright: ƒ.Vector3 = new ƒ.Vector3(0.75, -0.75, 0);
            //let pivot: ƒ.Matrix4x4 = this.getComponent(ƒ.ComponentMesh).pivot;
            let mtxResult = ƒ.Matrix4x4.MULTIPLICATION(this.mtxWorld, Floor.pivot);
            topleft.transform(mtxResult, true);
            bottomright.transform(mtxResult, true);
            let size = new ƒ.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
            rect.position = topleft.toVector2();
            rect.size = size;
            return rect;
        }
    }
    Floor.mesh = new ƒ.MeshSprite();
    Floor.pivot = ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(-0.5));
    PrimaAdventure.Floor = Floor;
})(PrimaAdventure || (PrimaAdventure = {}));
//# sourceMappingURL=Floor.js.map