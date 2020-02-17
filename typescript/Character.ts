namespace PrimaAdventure {
  import ƒ = FudgeCore;

  export enum ACTION {
    IDLE = "Idle",
    WALK = "Walk",
    JUMP = "Jump"
  }
  export enum DIRECTION {
    LEFT, RIGHT
  }

  export class Character extends ƒ.Node {
    private static sprites: Sprite[];
    private static speedMax: ƒ.Vector2 = new ƒ.Vector2(1.5, 5); // units per second
    private static gravity: ƒ.Vector2 = ƒ.Vector2.Y(-3);
    // private time: ƒ.Time = new ƒ.Time();
    public speed: ƒ.Vector3 = ƒ.Vector3.ZERO();
    public healthpoints: number = 100;
    public demage: number = 20;
    public defeatedEnemies: number = 0;

    constructor(_name: string = "Hare") {
      super(_name);
      this.addComponent(new ƒ.ComponentTransform());

      for (let sprite of Character.sprites) {
        let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
        nodeSprite.activate(false);

        nodeSprite.addEventListener(
          "showNext",
          (_event: Event) => { (<NodeSprite>_event.currentTarget).showFrameNext(); },
          true
        );

        this.appendChild(nodeSprite);
      }

      this.show(ACTION.IDLE);
      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
    }

    public static generateSprites(_txtImage: ƒ.TextureImage): void {
      Character.sprites = [];
      let sprite: Sprite = new Sprite(ACTION.WALK);
      sprite.generateByGrid(_txtImage, ƒ.Rectangle.GET(0, 110, 110, 87), 15, ƒ.Vector2.ZERO(), 100, ƒ.ORIGIN2D.BOTTOMCENTER);
      Character.sprites.push(sprite);

      sprite = new Sprite(ACTION.IDLE);
      sprite.generateByGrid(_txtImage, ƒ.Rectangle.GET(0, 0, 110, 87), 14, ƒ.Vector2.ZERO(), 100, ƒ.ORIGIN2D.BOTTOMCENTER);
      Character.sprites.push(sprite);
    }

    public show(_action: ACTION): void {
      if (_action == ACTION.JUMP)
        return;
      for (let child of this.getChildren())
        child.activate(child.name == _action);
      // this.action = _action;
    }

    public act(_action: ACTION, _direction?: DIRECTION): void {
      switch (_action) {
        case ACTION.IDLE:
          this.speed.x = 0;
          break;
        case ACTION.WALK:
          let direction: number = (_direction == DIRECTION.RIGHT ? 1 : -1);
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

    private update = (_event: ƒ.Eventƒ): void => {
      this.broadcastEvent(new CustomEvent("showNext"));

      let timeFrame: number = ƒ.Loop.timeFrameGame / 1000;
      this.speed.y += Character.gravity.y * timeFrame;
      let distance: ƒ.Vector3 = ƒ.Vector3.SCALE(this.speed, timeFrame);
      this.cmpTransform.local.translate(distance);

      this.checkCollision();
    }

    private checkCollision(): void {
      // Namen anpassen
      for (let floor of level.getChildren()) {
        let rect: ƒ.Rectangle = (<Floor>floor).getRectWorld();
        //console.log(rect.toString());
        let hit: boolean = rect.isInside(this.cmpTransform.local.translation.toVector2());
        if (hit && (<Floor>floor).rectEnabled) {
          let translation: ƒ.Vector3 = this.cmpTransform.local.translation;
          translation.y = rect.y;
          this.cmpTransform.local.translation = translation;
          this.speed.y = 0;
        }

        if (hit && floor instanceof Enemy && (<Floor>floor).rectEnabled) {
          // console.log("Hit");
          console.log("HIT");
          this.fight(floor);
        }

        if (hit && floor instanceof Healthpotion && (<Healthpotion>floor).rectEnabled) {
          this.heal(floor);
        }
      }
    }

    private fight(_enemy: Enemy): void {
      audioSword.play();
      while (this.healthpoints > 0 && _enemy.healthpoints > 0) {
        _enemy.healthpoints -= this.demage;
        if (_enemy.healthpoints <= 0) {
          console.log("won");
          _enemy.activate(false);
          _enemy.rectEnabled = false;
          this.defeatedEnemies ++;
          console.log(this.defeatedEnemies);
          if (_enemy instanceof Boss) {
            gameWon = true;
            fanfare.play();
            ƒ.Loop.stop();
            document.getElementById("anweisung").innerText = "Gewonnen. Neuladen, um von vonrne zu beginnen";
            sceneCamera.componentCamera.pivot.translateY(10);
            viewport.draw();
            alert("Game Won");
          }
          if (this.defeatedEnemies >= targetToSpawnBoss && gameWon == false) {
            let boss: Boss = new Boss("crimson", 1);
            boss.cmpTransform.local.translateX(19);
            level.appendChild(boss);
            console.log("boss spwaned");
          }
          break;
        }
        this.healthpoints -= _enemy.demage;
        if (this.healthpoints <= 0) {
          console.log("lost");
          document.getElementById("anweisung").innerText = "Verloren. Neuladen um wieder von vorne zu beginnen";
          sceneCamera.componentCamera.pivot.translateY(10);
          viewport.draw();
          alert("Lost");
          ƒ.Loop.stop();
          break;
        }
      }
    }

    private heal(_healthpotion: Healthpotion): void {
      //this.healthpoints += _healthpotion.value.valueOf();
      bubble.play();
      console.log("Heal: " + (<Healthpotion>_healthpotion).value);
      this.healthpoints += (<Healthpotion>_healthpotion).value;
      _healthpotion.activate(false);
      _healthpotion.rectEnabled = false;
    }
  }
}
