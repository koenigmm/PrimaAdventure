"use strict";
var PrimaAdventure;
(function (PrimaAdventure) {
    var ƒ = FudgeCore;
    let ACTION;
    (function (ACTION) {
        ACTION["IDLE"] = "Idle";
        ACTION["WALK"] = "Walk";
        ACTION["JUMP"] = "Jump";
    })(ACTION = PrimaAdventure.ACTION || (PrimaAdventure.ACTION = {}));
    let DIRECTION;
    (function (DIRECTION) {
        DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
        DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    })(DIRECTION = PrimaAdventure.DIRECTION || (PrimaAdventure.DIRECTION = {}));
    class Character extends ƒ.Node {
        constructor(_name = "Hare") {
            super(_name);
            // private time: ƒ.Time = new ƒ.Time();
            this.speed = ƒ.Vector3.ZERO();
            this.healthpoints = 100;
            this.demage = 20;
            this.defeatedEnemies = 0;
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = ƒ.Loop.timeFrameGame / 1000;
                this.speed.y += Character.gravity.y * timeFrame;
                let distance = ƒ.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
                this.checkCollision();
            };
            this.addComponent(new ƒ.ComponentTransform());
            for (let sprite of Character.sprites) {
                let nodeSprite = new PrimaAdventure.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => { _event.currentTarget.showFrameNext(); }, true);
                this.appendChild(nodeSprite);
            }
            this.show(ACTION.IDLE);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            Character.sprites = [];
            let sprite = new PrimaAdventure.Sprite(ACTION.WALK);
            sprite.generateByGrid(_txtImage, ƒ.Rectangle.GET(0, 110, 110, 87), 15, ƒ.Vector2.ZERO(), 100, ƒ.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
            sprite = new PrimaAdventure.Sprite(ACTION.IDLE);
            sprite.generateByGrid(_txtImage, ƒ.Rectangle.GET(0, 0, 110, 87), 14, ƒ.Vector2.ZERO(), 100, ƒ.ORIGIN2D.BOTTOMCENTER);
            Character.sprites.push(sprite);
        }
        show(_action) {
            if (_action == ACTION.JUMP)
                return;
            for (let child of this.getChildren())
                child.activate(child.name == _action);
            // this.action = _action;
        }
        act(_action, _direction) {
            switch (_action) {
                case ACTION.IDLE:
                    this.speed.x = 0;
                    break;
                case ACTION.WALK:
                    let direction = (_direction == DIRECTION.RIGHT ? 1 : -1);
                    this.speed.x = Character.speedMax.x; // * direction;
                    this.cmpTransform.local.rotation = ƒ.Vector3.Y(90 - 90 * direction);
                    // console.log(direction);
                    break;
                case ACTION.JUMP:
                    this.speed.y = 2.5;
                    break;
            }
            this.show(_action);
        }
        checkCollision() {
            // Namen anpassen
            for (let floor of PrimaAdventure.level.getChildren()) {
                let rect = floor.getRectWorld();
                //console.log(rect.toString());
                let hit = rect.isInside(this.cmpTransform.local.translation.toVector2());
                if (hit && floor.rectEnabled) {
                    let translation = this.cmpTransform.local.translation;
                    translation.y = rect.y;
                    this.cmpTransform.local.translation = translation;
                    this.speed.y = 0;
                }
                if (hit && floor instanceof PrimaAdventure.Enemy && floor.rectEnabled) {
                    // console.log("Hit");
                    console.log("HIT");
                    this.fight(floor);
                }
                if (hit && floor instanceof PrimaAdventure.Healthpotion && floor.rectEnabled) {
                    this.heal(floor);
                }
            }
        }
        fight(_enemy) {
            PrimaAdventure.audioSword.play();
            while (this.healthpoints > 0 && _enemy.healthpoints > 0) {
                _enemy.healthpoints -= this.demage;
                if (_enemy.healthpoints <= 0) {
                    console.log("won");
                    _enemy.activate(false);
                    _enemy.rectEnabled = false;
                    this.defeatedEnemies++;
                    console.log(this.defeatedEnemies);
                    if (_enemy instanceof PrimaAdventure.Boss) {
                        PrimaAdventure.gameWon = true;
                        PrimaAdventure.fanfare.play();
                        ƒ.Loop.stop();
                        document.getElementById("anweisung").innerText = "Gewonnen. Neuladen, um von vonrne zu beginnen";
                        PrimaAdventure.sceneCamera.componentCamera.pivot.translateY(10);
                        PrimaAdventure.viewport.draw();
                        alert("Game Won");
                    }
                    if (this.defeatedEnemies >= PrimaAdventure.targetToSpawnBoss && PrimaAdventure.gameWon == false) {
                        let boss = new PrimaAdventure.Boss("crimson", 1);
                        boss.cmpTransform.local.translateX(19);
                        PrimaAdventure.level.appendChild(boss);
                        console.log("boss spwaned");
                    }
                    break;
                }
                this.healthpoints -= _enemy.demage;
                if (this.healthpoints <= 0) {
                    console.log("lost");
                    document.getElementById("anweisung").innerText = "Verloren. Neuladen um wieder von vorne zu beginnen";
                    PrimaAdventure.sceneCamera.componentCamera.pivot.translateY(10);
                    PrimaAdventure.viewport.draw();
                    alert("Lost");
                    ƒ.Loop.stop();
                    break;
                }
            }
        }
        heal(_healthpotion) {
            //this.healthpoints += _healthpotion.value.valueOf();
            PrimaAdventure.bubble.play();
            console.log("Heal: " + _healthpotion.value);
            this.healthpoints += _healthpotion.value;
            _healthpotion.activate(false);
            _healthpotion.rectEnabled = false;
        }
    }
    Character.speedMax = new ƒ.Vector2(1.5, 5); // units per second
    Character.gravity = ƒ.Vector2.Y(-3);
    PrimaAdventure.Character = Character;
})(PrimaAdventure || (PrimaAdventure = {}));
//# sourceMappingURL=Character.js.map