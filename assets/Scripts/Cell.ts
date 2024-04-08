import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {

    @property(Sprite)
    sprX: Sprite = null;

    @property(Sprite)
    sprO: Sprite = null;

    start() {
        this.reset();
    }

    update(deltaTime: number) {
        
    }

    setO() {
        this.sprX.enabled = false;
        this.sprO.enabled = true;
    }

    setX() {
        this.sprO.enabled = false;
        this.sprX.enabled = true;
    }

    reset() {
        this.sprX.enabled = false;
        this.sprO.enabled = false;
    }
}


