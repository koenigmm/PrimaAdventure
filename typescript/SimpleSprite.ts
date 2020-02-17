import ƒ = FudgeCore;

namespace PrimaAdventure {
    export class SimpleSprite extends ƒ.Node {
        private textureImage: ƒ.TextureImage = new ƒ.TextureImage;
        private coat: ƒ.CoatTextured = new ƒ.CoatTextured();
        private mesh: ƒ.Mesh = new ƒ.MeshSprite();
        private material: ƒ.Material;
        private rectangle: ƒ.Rectangle;
        private defaultTranslation: ƒ.Vector3 = new ƒ.Vector3 (0, 0, 2);
        public constructor(_img: HTMLImageElement, _scaling: number, _position?: ƒ.Vector3) {
            super("SimpleSprite");
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
        public changeTextureImage(_img: HTMLImageElement): void {
            this.textureImage.image = _img;
            this.coat.texture = this.textureImage;
        }

        public scaleToFitAspectRatio(_scaling: number): void {
            this.getComponent(ƒ.ComponentTransform).local.scaleX(this.rectangle.width / _scaling);
            this.getComponent(ƒ.ComponentTransform).local.scaleY(this.rectangle.height / _scaling);
        }

        private setPosition(_position: ƒ.Vector3): void {
            if (_position != null) {
                this.getComponent(ƒ.ComponentTransform).local.translation = _position;
            }
            else {
                this.getComponent(ƒ.ComponentTransform).local.translation = this.defaultTranslation;
            }
        }
    }
}