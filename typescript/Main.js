"use strict";
var PrimaAdventure;
(function (PrimaAdventure) {
    var ƒ = FudgeCore;
    PrimaAdventure.game = new ƒ.Node("game");
    PrimaAdventure.targetToSpawnBoss = 5;
    PrimaAdventure.gameWon = false;
    let sceneCamera;
    let character;
    let delayesAssetsSpawned = false;
    let spawnedMessage = "First Wave";
    PrimaAdventure.keysPressed = {};
    window.addEventListener("load", hndLoad);
    function hndLoad(_event) {
        PrimaAdventure.time = new ƒ.Time();
        const canvas = document.querySelector("canvas");
        PrimaAdventure.audioSword = new Audio("swordSound.wav");
        PrimaAdventure.fanfare = new Audio("fanfare.wav");
        PrimaAdventure.bubble = new Audio("heal.wav");
        PrimaAdventure.txtAnweisung = document.getElementById("anweisung");
        PrimaAdventure.txtAnweisung.innerText = "Dein Hut wurde von einem Monster geklaut. Wenn du seine Helfer besiegst, wird das Monster erscheinen. Besiegst Du das Monster, bekommst du Deinen Hut zurück und das Spiel ist gewonnen.";
        PrimaAdventure.level = createFloors();
        PrimaAdventure.game.appendChild(PrimaAdventure.level);
        PrimaAdventure.canvasRenderingContext = canvas.getContext("2d");
        createEnemiesAndAppend();
        createHealthpotionsAndAppend();
        sceneCamera = new PrimaAdventure.SceneCamera(5, ƒ.Color.CSS("white"));
        createSimpleSpritesAndAppend(0);
        createSimpleSpritesAndAppend(8);
        createSimpleSpritesAndAppend(16);
        createSimpleSpritesAndAppend(24);
        createBackgroundAndAppend();
        let img2 = document.querySelector("#character");
        let texture01 = new ƒ.TextureImage();
        texture01.image = img2;
        PrimaAdventure.Character.generateSprites(texture01);
        character = new PrimaAdventure.Character("Character");
        PrimaAdventure.game.appendChild(character);
        PrimaAdventure.viewport = new ƒ.Viewport();
        ƒ.RenderManager.initialize();
        PrimaAdventure.viewport.initialize("Viewport", PrimaAdventure.game, sceneCamera.componentCamera, canvas);
        PrimaAdventure.viewport.draw();
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);
    }
    function update(_event) {
        let timeAsNumber = PrimaAdventure.time.get();
        let timeAsSeconds = Math.floor(timeAsNumber / 1000);
        if (delayesAssetsSpawned == false) {
            createDelayedAssets(20000);
        }
        if (PrimaAdventure.gameWon == false) {
            processInput();
            if (character.defeatedEnemies >= 0) {
                PrimaAdventure.leftGuiText = PrimaAdventure.targetToSpawnBoss - character.defeatedEnemies + " enemies left";
            }
            if (character.defeatedEnemies == PrimaAdventure.targetToSpawnBoss) {
                PrimaAdventure.leftGuiText = "Boss Spwaned";
            }
            PrimaAdventure.viewport.draw();
            PrimaAdventure.canvasRenderingContext.font = "30px sans-serif";
            PrimaAdventure.canvasRenderingContext.fillText(PrimaAdventure.leftGuiText, 10, 50);
            PrimaAdventure.canvasRenderingContext.fillText("HP " + character.healthpoints.toString(), 760, 50);
            PrimaAdventure.canvasRenderingContext.fillText("time: " + timeAsSeconds.toString(), 400, 570);
            PrimaAdventure.canvasRenderingContext.fillText(spawnedMessage, 400, 50);
        }
    }
    function handleKeyboard(_event) {
        PrimaAdventure.keysPressed[_event.code] = (_event.type == "keydown");
        if (_event.code == ƒ.KEYBOARD_CODE.SPACE && _event.type == "keydown")
            character.act(PrimaAdventure.ACTION.JUMP);
    }
    function processInput() {
        if (PrimaAdventure.keysPressed[ƒ.KEYBOARD_CODE.A] && sceneCamera.componentCamera.pivot.translation.x >= -3) {
            character.act(PrimaAdventure.ACTION.WALK, PrimaAdventure.DIRECTION.LEFT);
            sceneCamera.componentCamera.pivot.translateX(-0.15);
            return;
        }
        if (PrimaAdventure.keysPressed[ƒ.KEYBOARD_CODE.D] && sceneCamera.componentCamera.pivot.translation.x <= 19) {
            character.act(PrimaAdventure.ACTION.WALK, PrimaAdventure.DIRECTION.RIGHT);
            sceneCamera.componentCamera.pivot.translateX(0.15);
            return;
        }
        character.act(PrimaAdventure.ACTION.IDLE);
    }
    function createFloors() {
        let level = new ƒ.Node("Level");
        fetch("./typescript/coordinates.json")
            .then((response) => response.json()
            .then((data) => {
            console.log(data.potions);
            let floorGround = new PrimaAdventure.Floor("darkslategray");
            floorGround.cmpTransform.local.scaleY(0.4);
            floorGround.cmpTransform.local.scaleX(40);
            // floorGround.cmpTransform.local.translateY(-1.3);
            // floorGround.cmpTransform.local.translateX(10);
            floorGround.cmpTransform.local.translation = new ƒ.Vector3(data.floors[0].x, data.floors[0].y, data.floors[0].z);
            level.appendChild(floorGround);
            let floor = new PrimaAdventure.Floor();
            floor.cmpTransform.local.scaleY(0.2);
            // floor.cmpTransform.local.translateY(-0.2);
            floor.cmpTransform.local.translation = new ƒ.Vector3(data.floors[1].x, data.floors[1].y, data.floors[1].z);
            level.appendChild(floor);
            let floor02 = new PrimaAdventure.Floor();
            floor02.cmpTransform.local.scaleY(0.2);
            floor02.cmpTransform.local.scaleX(2);
            // floor02.cmpTransform.local.translateX(2);
            floor02.cmpTransform.local.translation = new ƒ.Vector3(data.floors[2].x, data.floors[2].y, data.floors[2].z);
            level.appendChild(floor02);
            let floor03 = new PrimaAdventure.Floor();
            floor03.cmpTransform.local.scaleY(0.2);
            floor03.cmpTransform.local.scaleX(2);
            // floor03.cmpTransform.local.translateX(15);
            floor03.cmpTransform.local.translation = new ƒ.Vector3(data.floors[3].x, data.floors[3].y, data.floors[3].z);
            level.appendChild(floor03);
            let floor04 = new PrimaAdventure.Floor();
            floor04.cmpTransform.local.scaleY(0.2);
            floor04.cmpTransform.local.scaleX(2);
            // floor04.cmpTransform.local.translateX(17);
            // floor04.cmpTransform.local.translateY(-0.5);
            floor04.cmpTransform.local.translation = new ƒ.Vector3(data.floors[4].x, data.floors[4].y, data.floors[4].z);
            level.appendChild(floor04);
        }));
        return level;
    }
    function createEnemiesAndAppend() {
        let enemy01 = new PrimaAdventure.Enemy();
        enemy01.cmpTransform.local.translation = new ƒ.Vector3(2, 0.5);
        PrimaAdventure.level.appendChild(enemy01);
        let enemy02 = new PrimaAdventure.Enemy();
        enemy02.cmpTransform.local.translateX(4);
        enemy02.cmpTransform.local.translateY(0.25);
        PrimaAdventure.level.appendChild(enemy02);
        let enemy03 = new PrimaAdventure.Enemy();
        enemy03.cmpTransform.local.translation = new ƒ.Vector3(15, 0.5);
        PrimaAdventure.level.appendChild(enemy03);
        let enemy05 = new PrimaAdventure.Enemy();
        enemy05.cmpTransform.local.translation = new ƒ.Vector3(7, -0.5);
        PrimaAdventure.level.appendChild(enemy05);
    }
    function createDelayedAssets(_delay) {
        if (PrimaAdventure.time.get() >= _delay) {
            console.log("H");
            let enemy04 = new PrimaAdventure.Enemy();
            enemy04.cmpTransform.local.translation = new ƒ.Vector3(17, 0);
            PrimaAdventure.level.appendChild(enemy04);
            let healthPotion04 = new PrimaAdventure.Healthpotion(60);
            healthPotion04.cmpTransform.local.translateX(17.75);
            PrimaAdventure.level.appendChild(healthPotion04);
            delayesAssetsSpawned = true;
            spawnedMessage = "Second Wave";
        }
    }
    function createHealthpotionsAndAppend() {
        let healthPotion01 = new PrimaAdventure.Healthpotion(20);
        healthPotion01.cmpTransform.local.translateX(10);
        PrimaAdventure.level.appendChild(healthPotion01);
        let healthPotion02 = new PrimaAdventure.Healthpotion(40);
        healthPotion02.cmpTransform.local.translateX(2.75);
        healthPotion02.cmpTransform.local.translateY(0.5);
        PrimaAdventure.level.appendChild(healthPotion02);
        let healthPotion03 = new PrimaAdventure.Healthpotion(40);
        healthPotion03.cmpTransform.local.translateX(10);
        PrimaAdventure.level.appendChild(healthPotion03);
        /* let healthPotion04: Healthpotion = new Healthpotion(60);
        healthPotion04.cmpTransform.local.translateX(17.75);
        level.appendChild(healthPotion04); */
    }
    function createSimpleSpritesAndAppend(_offset) {
        let image = document.querySelector("#bild1");
        let image2 = document.querySelector("#bild2");
        let tex = new ƒ.TextureImage();
        tex.image = image2;
        let spriteNode = new ƒ.Node("SimpleSpritesNode");
        let tree01 = new PrimaAdventure.SimpleSprite(image, 1000, new ƒ.Vector3(2 + _offset, -1.5, -3));
        spriteNode.appendChild(tree01);
        let tree02 = new PrimaAdventure.SimpleSprite(image, 1000, new ƒ.Vector3(1 + _offset, -1.5, -4));
        spriteNode.appendChild(tree02);
        let tree03 = new PrimaAdventure.SimpleSprite(image, 1000, new ƒ.Vector3(-1 + _offset, -1, -1));
        spriteNode.appendChild(tree03);
        let tree04 = new PrimaAdventure.SimpleSprite(image, 1000, new ƒ.Vector3(-2 + _offset, -1, -3));
        spriteNode.appendChild(tree04);
        let tree05 = new PrimaAdventure.SimpleSprite(image, 1000, new ƒ.Vector3(3.5 + _offset, -0.75, 1));
        spriteNode.appendChild(tree05);
        let tree06 = new PrimaAdventure.SimpleSprite(image, 1000, new ƒ.Vector3(-3 + _offset, 0, -2));
        spriteNode.appendChild(tree06);
        let tree07 = new PrimaAdventure.SimpleSprite(image, 2000, new ƒ.Vector3(1 + _offset, 0.75, -4));
        spriteNode.appendChild(tree07);
        let tree08 = new PrimaAdventure.SimpleSprite(image, 2000, new ƒ.Vector3(2 + _offset, 0, -4));
        spriteNode.appendChild(tree08);
        let tree09 = new PrimaAdventure.SimpleSprite(image, 2000, new ƒ.Vector3(-3 + _offset, 0, -4));
        spriteNode.appendChild(tree09);
        let tree10 = new PrimaAdventure.SimpleSprite(image, 2000, new ƒ.Vector3(3 + _offset, 0.75, -4));
        spriteNode.appendChild(tree10);
        let tree11 = new PrimaAdventure.SimpleSprite(image, 2000, new ƒ.Vector3(4 + _offset, 0.75, -4));
        spriteNode.appendChild(tree11);
        let tree12 = new PrimaAdventure.SimpleSprite(image, 2000, new ƒ.Vector3(7 + _offset, 0.5, -4));
        spriteNode.appendChild(tree12);
        PrimaAdventure.game.appendChild(spriteNode);
    }
    function createBackgroundAndAppend() {
        let backgroundNode = new ƒ.Node("BackgroundNode");
        let bgImage = document.querySelector("#bg");
        let backgroundImage = new PrimaAdventure.SimpleSprite(bgImage, 300, new ƒ.Vector3(0, 0, -4.8));
        backgroundNode.appendChild(backgroundImage);
        let backgroundImageNegative = new PrimaAdventure.SimpleSprite(bgImage, 300, new ƒ.Vector3(-10, 0, -4.8));
        backgroundImageNegative.cmpTransform.local.rotateY(180);
        backgroundNode.appendChild(backgroundImageNegative);
        let backgroundImage02 = new PrimaAdventure.SimpleSprite(bgImage, 300, new ƒ.Vector3(10, 0, -4.8));
        backgroundImage02.cmpTransform.local.rotateY(180);
        backgroundNode.appendChild(backgroundImage02);
        let backgroundImage03 = new PrimaAdventure.SimpleSprite(bgImage, 300, new ƒ.Vector3(20, 0, -4.8));
        backgroundNode.appendChild(backgroundImage03);
        PrimaAdventure.game.appendChild(backgroundNode);
    }
})(PrimaAdventure || (PrimaAdventure = {}));
//# sourceMappingURL=Main.js.map