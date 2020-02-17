"use strict";
var ƒ = FudgeCore;
var PrimaAdventure;
(function (PrimaAdventure) {
    class SimpleSprite extends ƒ.Node {
        constructor(_img, _scaling, _position) {
            super("SimpleSprite");
            this.textureImage = new ƒ.TextureImage;
            this.coat = new ƒ.CoatTextured();
            this.mesh = new ƒ.MeshSprite();
            this.defaultTranslation = new ƒ.Vector3(0, 0, 2);
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(this.mesh));
            this.material = new ƒ.Material("SimpleSpriteMaterial", ƒ.ShaderTexture, this.coat);
            this.textureImage.image = _img;
            this.coat.texture = this.textureImage;
            this.addComponent(new ƒ.ComponentMaterial(this.material));
            this.rectangle = new ƒ.Rectangle(0, 0, _img.width, _img.height);
            this.scaleToFitAspectRatio(_scaling);
            this.setPosition(_position);
        }
        changeTextureImage(_img) {
            this.textureImage.image = _img;
            this.coat.texture = this.textureImage;
        }
        scaleToFitAspectRatio(_scaling) {
            this.getComponent(ƒ.ComponentTransform).local.scaleX(this.rectangle.width / _scaling);
            this.getComponent(ƒ.ComponentTransform).local.scaleY(this.rectangle.height / _scaling);
        }
        setPosition(_position) {
            if (_position != null) {
                this.getComponent(ƒ.ComponentTransform).local.translation = _position;
            }
            else {
                this.getComponent(ƒ.ComponentTransform).local.translation = this.defaultTranslation;
            }
        }
    }
    PrimaAdventure.SimpleSprite = SimpleSprite;
})(PrimaAdventure || (PrimaAdventure = {}));
//# sourceMappingURL=SimpleSprite.js.map