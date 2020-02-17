namespace PrimaAdventure {
    import ƒ = FudgeCore;
    export let game: ƒ.Node = new ƒ.Node("game");
    export let level: ƒ.Node;
    export let canvasRenderingContext: CanvasRenderingContext2D;
    export let txtAnweisung: HTMLElement;
    export let targetToSpawnBoss: number = 5;
    export let gameWon: boolean = false;
    export let leftGuiText: string;
    export let viewport: ƒ.Viewport;
    export let audioSword: HTMLAudioElement;
    export let bubble: HTMLAudioElement;
    export let fanfare: HTMLAudioElement;
    let sceneCamera: SceneCamera;
    let character: Character;
    let delayesAssetsSpawned: boolean = false;
    let spawnedMessage: string = "First Wave";
    export let time: ƒ.Time;

    interface KeyPressed {
        [code: string]: boolean;
    }
    export let keysPressed: KeyPressed = {};

    window.addEventListener("load", hndLoad);

    function hndLoad(_event: Event): void {
        time = new ƒ.Time();
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        audioSword = new Audio("swordSound.wav");
        fanfare = new Audio("fanfare.wav");
        bubble = new Audio("heal.wav");
        txtAnweisung = document.getElementById("anweisung");
        txtAnweisung.innerText = "Dein Hut wurde von einem Monster geklaut. Wenn du seine Helfer besiegst, wird das Monster erscheinen. Besiegst Du das Monster, bekommst du Deinen Hut zurück und das Spiel ist gewonnen.";
        level = createFloors();
        game.appendChild(level);
        canvasRenderingContext = canvas.getContext("2d");
        createEnemiesAndAppend();
        createHealthpotionsAndAppend();

        sceneCamera = new SceneCamera(5, ƒ.Color.CSS("white"));

        createSimpleSpritesAndAppend(0);
        createSimpleSpritesAndAppend(8);
        createSimpleSpritesAndAppend(16);
        createSimpleSpritesAndAppend(24);
        createBackgroundAndAppend();

        let img2: HTMLImageElement = document.querySelector("#character");
        let texture01: ƒ.TextureImage = new ƒ.TextureImage();
        texture01.image = img2;
        Character.generateSprites(texture01);
        character = new Character("Character");
        game.appendChild(character);

        viewport = new ƒ.Viewport();
        ƒ.RenderManager.initialize();
        viewport.initialize("Viewport", game, sceneCamera.componentCamera, canvas);
        viewport.draw();

        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);


    }

    function update(_event: ƒ.Eventƒ): void {
        let timeAsNumber: number = time.get();
        let timeAsSeconds: number = Math.floor(timeAsNumber / 1000);
        if (delayesAssetsSpawned == false) {
            createDelayedAssets(20000);
        }
        if (gameWon == false) {
            processInput();
            if (character.defeatedEnemies >= 0) {
                leftGuiText = targetToSpawnBoss - character.defeatedEnemies + " enemies left";
            }
            if (character.defeatedEnemies == targetToSpawnBoss) {
                leftGuiText = "Boss Spwaned";
            }

            viewport.draw();

            canvasRenderingContext.font = "30px sans-serif";
            canvasRenderingContext.fillText(leftGuiText, 10, 50);
            canvasRenderingContext.fillText("HP " + character.healthpoints.toString(), 760, 50);
            canvasRenderingContext.fillText("time: " + timeAsSeconds.toString(), 400, 570);
            canvasRenderingContext.fillText(spawnedMessage, 400, 50);
        }
    }


    function handleKeyboard(_event: KeyboardEvent): void {
        keysPressed[_event.code] = (_event.type == "keydown");
        if (_event.code == ƒ.KEYBOARD_CODE.SPACE && _event.type == "keydown")
            character.act(ACTION.JUMP);
    }

    function processInput(): void {
        if (keysPressed[ƒ.KEYBOARD_CODE.A] && sceneCamera.componentCamera.pivot.translation.x >= -3) {
            character.act(ACTION.WALK, DIRECTION.LEFT);
            sceneCamera.componentCamera.pivot.translateX(-0.15);
            return;
        }
        if (keysPressed[ƒ.KEYBOARD_CODE.D] && sceneCamera.componentCamera.pivot.translation.x <= 19) {
            character.act(ACTION.WALK, DIRECTION.RIGHT);
            sceneCamera.componentCamera.pivot.translateX(0.15);
            return;
        }

        character.act(ACTION.IDLE);
    }

    function createFloors(): ƒ.Node {
        let level: ƒ.Node = new ƒ.Node("Level");

        let floorGround: Floor = new Floor("darkslategray");
        floorGround.cmpTransform.local.scaleY(0.4);
        floorGround.cmpTransform.local.scaleX(40);
        floorGround.cmpTransform.local.translateY(-1.3);
        floorGround.cmpTransform.local.translateX(10);
        level.appendChild(floorGround);

        let floor: Floor = new Floor();
        floor.cmpTransform.local.scaleY(0.2);
        floor.cmpTransform.local.translateY(-0.2);
        level.appendChild(floor);

        let floor02: Floor = new Floor();
        floor02.cmpTransform.local.scaleY(0.2);
        floor02.cmpTransform.local.scaleX(2);
        floor02.cmpTransform.local.translateX(2);
        level.appendChild(floor02);

        let floor03: Floor = new Floor();
        floor03.cmpTransform.local.scaleY(0.2);
        floor03.cmpTransform.local.scaleX(2);
        floor03.cmpTransform.local.translateX(15);
        level.appendChild(floor03);

        let floor04: Floor = new Floor();
        floor04.cmpTransform.local.scaleY(0.2);
        floor04.cmpTransform.local.scaleX(2);
        floor04.cmpTransform.local.translateX(17);
        floor04.cmpTransform.local.translateY(-0.5);
        level.appendChild(floor04);

        return level;
    }

    function createEnemiesAndAppend(): void {
        let enemy01: Enemy = new Enemy();
        enemy01.cmpTransform.local.translation = new ƒ.Vector3(2, 0.5);
        level.appendChild(enemy01);

        let enemy02: Enemy = new Enemy();
        enemy02.cmpTransform.local.translateX(4);
        enemy02.cmpTransform.local.translateY(0.25);
        level.appendChild(enemy02);

        let enemy03: Enemy = new Enemy();
        enemy03.cmpTransform.local.translation = new ƒ.Vector3(15, 0.5);
        level.appendChild(enemy03);


        let enemy05: Enemy = new Enemy();
        enemy05.cmpTransform.local.translation = new ƒ.Vector3(7, -0.5);
        level.appendChild(enemy05);

    }

    function createDelayedAssets(_delay: number): void {
        if (time.get() >= _delay) {
            console.log("H");
            let enemy04: Enemy = new Enemy();
            enemy04.cmpTransform.local.translation = new ƒ.Vector3(17, 0);
            level.appendChild(enemy04);

            let healthPotion04: Healthpotion = new Healthpotion(60);
            healthPotion04.cmpTransform.local.translateX(17.75);
            level.appendChild(healthPotion04);
            delayesAssetsSpawned = true;
            spawnedMessage = "Second Wave";

        }
    }

    function createHealthpotionsAndAppend(): void {
        let healthPotion01: Healthpotion = new Healthpotion(20);
        healthPotion01.cmpTransform.local.translateX(10);
        level.appendChild(healthPotion01);

        let healthPotion02: Healthpotion = new Healthpotion(40);
        healthPotion02.cmpTransform.local.translateX(2.75);
        healthPotion02.cmpTransform.local.translateY(0.5);
        level.appendChild(healthPotion02);

        let healthPotion03: Healthpotion = new Healthpotion(40);
        healthPotion03.cmpTransform.local.translateX(10);
        level.appendChild(healthPotion03);

        /* let healthPotion04: Healthpotion = new Healthpotion(60);
        healthPotion04.cmpTransform.local.translateX(17.75);
        level.appendChild(healthPotion04); */

    }


    function createSimpleSpritesAndAppend(_offset: number): void {
        let image: HTMLImageElement = document.querySelector("#bild1");
        let image2: HTMLImageElement = document.querySelector("#bild2");
        let tex: ƒ.TextureImage = new ƒ.TextureImage();
        tex.image = image2;

        let spriteNode: ƒ.Node = new ƒ.Node("SimpleSpritesNode");
        let tree01: SimpleSprite = new SimpleSprite(image, 1000, new ƒ.Vector3(2 + _offset, -1.5, -3));
        spriteNode.appendChild(tree01);

        let tree02: SimpleSprite = new SimpleSprite(image, 1000, new ƒ.Vector3(1 + _offset, -1.5, -4));
        spriteNode.appendChild(tree02);

        let tree03: SimpleSprite = new SimpleSprite(image, 1000, new ƒ.Vector3(-1 + _offset, -1, -1));
        spriteNode.appendChild(tree03);

        let tree04: SimpleSprite = new SimpleSprite(image, 1000, new ƒ.Vector3(-2 + _offset, -1, -3));
        spriteNode.appendChild(tree04);

        let tree05: SimpleSprite = new SimpleSprite(image, 1000, new ƒ.Vector3(3.5 + _offset, -0.75, 1));
        spriteNode.appendChild(tree05);

        let tree06: SimpleSprite = new SimpleSprite(image, 1000, new ƒ.Vector3(-3 + _offset, 0, -2));
        spriteNode.appendChild(tree06);

        let tree07: SimpleSprite = new SimpleSprite(image, 2000, new ƒ.Vector3(1 + _offset, 0.75, -4));
        spriteNode.appendChild(tree07);

        let tree08: SimpleSprite = new SimpleSprite(image, 2000, new ƒ.Vector3(2 + _offset, 0, -4));
        spriteNode.appendChild(tree08);

        let tree09: SimpleSprite = new SimpleSprite(image, 2000, new ƒ.Vector3(-3 + _offset, 0, -4));
        spriteNode.appendChild(tree09);

        let tree10: SimpleSprite = new SimpleSprite(image, 2000, new ƒ.Vector3(3 + _offset, 0.75, -4));
        spriteNode.appendChild(tree10);

        let tree11: SimpleSprite = new SimpleSprite(image, 2000, new ƒ.Vector3(4 + _offset, 0.75, -4));
        spriteNode.appendChild(tree11);

        let tree12: SimpleSprite = new SimpleSprite(image, 2000, new ƒ.Vector3(7 + _offset, 0.5, -4));
        spriteNode.appendChild(tree12);


        game.appendChild(spriteNode);
    }

    function createBackgroundAndAppend(): void {
        let backgroundNode: ƒ.Node = new ƒ.Node("BackgroundNode");

        let bgImage: HTMLImageElement = document.querySelector("#bg");
        let backgroundImage: SimpleSprite = new SimpleSprite(bgImage, 300, new ƒ.Vector3(0, 0, -4.8));
        backgroundNode.appendChild(backgroundImage);

        let backgroundImageNegative: SimpleSprite = new SimpleSprite(bgImage, 300, new ƒ.Vector3(-10, 0, -4.8));
        backgroundImageNegative.cmpTransform.local.rotateY(180);
        backgroundNode.appendChild(backgroundImageNegative);

        let backgroundImage02: SimpleSprite = new SimpleSprite(bgImage, 300, new ƒ.Vector3(10, 0, -4.8));
        backgroundImage02.cmpTransform.local.rotateY(180);
        backgroundNode.appendChild(backgroundImage02);

        let backgroundImage03: SimpleSprite = new SimpleSprite(bgImage, 300, new ƒ.Vector3(20, 0, -4.8));
        backgroundNode.appendChild(backgroundImage03);

        game.appendChild(backgroundNode);
    }



}
