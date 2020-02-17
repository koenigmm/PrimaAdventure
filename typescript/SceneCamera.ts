namespace PrimaAdventure {
    import ƒ = FudgeCore;

    export class SceneCamera {
        public distance: number;
        private cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        //private tranform: ƒ.ComponentTransform = new ƒ.ComponentTransform();

        constructor(distance: number, backgroundColor: ƒ.Color) {
            this.distance = distance;
            this.cmpCamera.backgroundColor = backgroundColor;
            //this.cmpCamera.pivot.translation = new ƒ.Vector3(0, 0, distance);
            this.cmpCamera.pivot.translateZ(distance);
            this.cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        }

        public get componentCamera(): ƒ.ComponentCamera {
            return this.cmpCamera;
        }


    }
}