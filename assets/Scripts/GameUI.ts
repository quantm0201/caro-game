import { _decorator, Button, Component, Label, Sprite, tween, Vec3 } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {

    @property(Label)
    lbNumTurn: Label = null;

    @property(Label)
    lbTurn: Label = null;

    @property(Label)
    lbWinner: Label = null;

    @property(Sprite)
    iconTurnO: Sprite = null;

    @property(Sprite)
    iconTurnX: Sprite = null;

    @property(Sprite)
    iconWinO: Sprite = null;

    @property(Sprite)
    iconWinX: Sprite = null;

    @property(Button)
    btnStart: Button = null;

    @property(Button)
    btnReset: Button = null;

    private _controller: GameController = null;

    start() {
        this.btnStart.node.on(Button.EventType.CLICK, this.onButtonStart, this);
        this.btnReset.node.on(Button.EventType.CLICK, this.onButtonReset, this);
    }

    update(deltaTime: number) {
        
    }

    setController(controller: GameController) {
        this._controller = controller;
    }

    resetUI() {
        this.lbNumTurn.node.active = false;
        this.lbTurn.node.active = false;
        this.lbWinner.node.active = false;
        this.iconTurnO.node.active = false;
        this.iconTurnX.node.active = false;
        this.iconWinO.node.active = false;
        this.iconWinX.node.active = false;
        this.btnStart.node.active = false;
        this.btnReset.node.active = false;
    }

    resetGame() {
        this.resetUI();
        this.btnStart.node.active = true;
    }

    startGame() {
        this.lbNumTurn.node.active = true;
        this.lbTurn.node.active = true;
        this.lbWinner.node.active = false;
        this.iconWinO.node.active = false;
        this.iconWinX.node.active = false;
        this.btnReset.node.active = true;
        this.btnStart.node.active = false;
        this.updateTurn();
    }

    endGame(winner: number) {
        this.lbWinner.node.active = true;
        this.iconWinO.node.active = winner === 0;
        this.iconWinX.node.active = winner === 1;

        this.lbWinner.node.scale = new Vec3(0, 0, 1);
        tween(this.lbWinner.node)
        .to(0.4, {scale: new Vec3(1, 1, 1)}, {easing: "backOut"})
        .start();

        this.iconWinO.node.scale = new Vec3(0, 0, 1);
        tween(this.iconWinO.node)
        .delay(0.2)
        .to(0.4, {scale: new Vec3(1, 1, 1)}, {easing: "backOut"})
        .start();

        this.iconWinX.node.scale = new Vec3(0, 0, 1);
        tween(this.iconWinX.node)
        .delay(0.2)
        .to(0.4, {scale: new Vec3(1, 1, 1)}, {easing: "backOut"})
        .start();
    }

    updateTurn() {
        const numTurn = this._controller.getTurn();
        this.lbNumTurn.string = "Number of turns: " + numTurn;

        const turnValue = this._controller.getValueByTurn();
        this.iconTurnO.node.active = turnValue === 0;
        this.iconTurnX.node.active = turnValue === 1;
    }

    onButtonStart() {
        if (this._controller) {
            this._controller.startGame();
        }
    }

    onButtonReset() {
        if (this._controller) {
            this._controller.resetGame();
            this._controller.startGame();
        }
    }
}


