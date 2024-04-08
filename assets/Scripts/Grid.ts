import { _decorator, Component, Prefab, instantiate, input, Input, EventMouse, UITransform, Vec2, Vec3, tween, UIOpacity } from 'cc';
import { GameController } from './GameController';
import { Cell } from './Cell';
const { ccclass, property } = _decorator;

@ccclass('Grid')
export class Grid extends Component {

    @property(Prefab)
    cellPrefab: Prefab = null;

    private _cellSize = 50;
    private _gridSize = 10;  // 10x10

    private _controller: GameController = null;
    private _cells: Array<Cell> = [];

    start() {
        
    }

    update(deltaTime: number) {
        
    }

    setController(controller: GameController) {
        this._controller = controller;
    }

    generateGrid(gridSize: number = 10) {
        this.clearGrid();

        this._gridSize = gridSize;
        const startX = - this._cellSize * gridSize / 2 + this._cellSize / 2;
        const startY = this._cellSize * gridSize / 2 - this._cellSize / 2;

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = instantiate(this.cellPrefab);
                const posX = startX + col * this._cellSize;
                const posY = startY - row * this._cellSize;
                cell.setPosition(posX, posY);
                this.node.addChild(cell);
                this._cells.push(cell.getComponent(Cell));
            }
        }
    }

    clearGrid() {
        for (let cell of this._cells) {
            cell.node.removeFromParent();
        }
        this._cells = [];
    }

    resetGame() {
        this.node.active = false;
        this.enableTouch(false);
        for (let cell of this._cells) {
            cell.reset();
        }
    }

    startGame() {
        this.node.active = true;
        let opacityComp = this.node.getComponent(UIOpacity);
        opacityComp.opacity = 0;
        tween(opacityComp)
        .to(0.7, {opacity: 255})
        .call(() => {
            this.enableTouch(true);
        })
        .start();
    }

    endGame() {
        this.enableTouch(false);
        let opacityComp = this.node.getComponent(UIOpacity);
        tween(opacityComp)
        .to(0.5, {opacity: 100})
        .start();
    }

    enableTouch(active: boolean = true) {
        if (active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
        else {
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }

    onMouseUp(event: EventMouse) {
        if (this._controller == null) {
            console.log("The game is not started");
            return;
        }

        const pos = event.getUILocation();
        const nodePos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y, 0));
        const coord = this._getCellCoordinationFromPosition(nodePos.x, nodePos.y);
        console.log("coord: ", coord);

        this._controller.playerChooseCell(coord.x, coord.y);
    }

    updateCellValue(x: number, y: number, value: number) {
        const cell = this._getCellFromCoordination(x, y);
        if (value == 0)
            cell.setO();
        else cell.setX();
    }

    private _getCellCoordinationFromPosition(x: number, y: number): Vec2 {
        const startX = - this._cellSize * this._gridSize / 2;
        const startY = this._cellSize * this._gridSize / 2;
        const coordX = Math.floor((x - startX) / this._cellSize);
        const coordY = Math.floor((startY - y) / this._cellSize);
        return new Vec2(coordX, coordY);
    }

    private _getCellFromCoordination(x: number, y: number) {
        if (x < 0 || x > this._gridSize - 1 || y < 0 || y > this._gridSize - 1) {
            console.log("Do not have a cell at this coord");
            return null;
        }
        return this._cells[y * this._gridSize + x];
    }
}


