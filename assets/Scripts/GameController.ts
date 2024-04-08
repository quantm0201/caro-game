import { _decorator, Component, Node } from 'cc';
import { Grid } from './Grid';
import { GameUI } from './GameUI';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {

    @property(GameUI)
    ui: GameUI = null;

    @property(Grid)
    grid: Grid = null;

    @property(Number)
    gridSize: number = 10;                  // 10x10

    private _turn: number = 0;              // number of turns
    private _cellValues: number[][] = [];   // 2-dimensions matrix (cell value: 0 for player O, 1 for player X and -1 if free)

    start() {
        this.initGame();
        this.ui.setController(this);
        this.grid.setController(this);

        this.resetGame();
    }

    update(deltaTime: number) {
        
    }

    // region Getter/Setter

    setTurn(turn: number) {
        this._turn = turn;
    }

    getTurn(): number {
        return this._turn;
    }

    // return 0 or 1, if 0 is O turn, 1 is X turn
    getValueByTurn() {
        return this._turn % 2;
    }

    setCellValue(x: number, y: number, value: number) {
        if (x < 0 || x > this.gridSize - 1 || y < 0 || y > this.gridSize - 1) {
            console.log("Do not have a cell at this coord");
            return;
        }
        if (value !== -1 && value !== 0 && value !== 1) {
            console.log("Invalid value, something wrong");
            return;
        }
        this._cellValues[x][y] = value;

        this.grid.updateCellValue(x, y, value);
    }

    getCellValue(x: number, y: number): number {
        if (x < 0 || x > this.gridSize - 1 || y < 0 || y > this.gridSize - 1) {
            return -1;
        }
        return this._cellValues[x][y];
    }

    // endregion

    // region Game Logic

    initGame() {
        this.grid.generateGrid(this.gridSize);

        this._turn = 0;
        this._cellValues = [];
        for (let row  = 0; row < this.gridSize; row++) {
            this._cellValues[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                this._cellValues[row][col] = -1;
            }
        }

        this.ui.resetUI();
    }

    resetGame() {
        // reset data
        this._turn = 0;
        for (let row  = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this._cellValues[row][col] = -1;
            }
        }

        // reset view
        this.grid.resetGame();

        // reset ui
        this.ui.resetGame();
    }

    startGame() {
        this.grid.startGame();
        this.ui.startGame();
    }

    endGame(winner: number) {
        this.grid.endGame();
        this.ui.endGame(winner);
    }

    nextTurn() {
        this._turn++;
        this.ui.updateTurn();
    }

    playerChooseCell(x: number, y: number) {
        if (x < 0 || x > this.gridSize - 1 || y < 0 || y > this.gridSize - 1) {
            console.log("Do not have a cell at this coord");
            return;
        }

        const cellValue = this.getCellValue(x, y);
        if (cellValue !== -1) {
            console.warn("This cell has been marked by player " + cellValue);
            return;
        }
        
        const turnValue = this.getValueByTurn();

        this.setCellValue(x, y, turnValue);

        const isWin = this.checkWinAtCell(x, y);
        if (isWin) {
            if (turnValue === 0) console.log("Player O win!");
            else console.log("Player X win!");
            this.endGame(turnValue);
        }
        else {
            this.nextTurn();
        }

    }

    checkWinAtCell(x: number, y: number): boolean {
        // Win when we have a row, or a column, or a cross of 5 same value cells

        const cellValue = this.getCellValue(x, y);

        if (cellValue == -1) {
            return false;
        }

        // check row
        let count = 1;
        for (let i = 1; i < 5; i++) {
            if (this.getCellValue(x - i, y) === cellValue) count++;
            else break;
        }
        for (let i = 1; i < 5; i++) {
            if (this.getCellValue(x + i, y) === cellValue) count++;
            else break;
        }
        if (count >= 5) return true;

        //check column
        count = 1;
        for (let i = 1; i < 5; i++) {
            if (this.getCellValue(x, y - i) === cellValue) count++;
            else break;
        }
        for (let i = 1; i < 5; i++) {
            if (this.getCellValue(x, y + i) === cellValue) count++;
            else break;
        }
        if (count >= 5) return true;

        //check cross 1
        count = 1;
        for (let i = 1; i < 5; i++) {
            if (this.getCellValue(x - i, y - i) === cellValue) count++;
            else break;
        }
        for (let i = 1; i < 5; i++) {
            if (this.getCellValue(x + i, y + i) === cellValue) count++;
            else break;
        }
        if (count >= 5) return true;

        //check cross 2
        count = 1;
        for (let i = 1; i < 5; i++) {
            if (this.getCellValue(x - i, y + i) === cellValue) count++;
            else break;
        }
        for (let i = 1; i < 5; i++) {
            if (this.getCellValue(x + i, y - i) === cellValue) count++;
            else break;
        }
        if (count >= 5) return true;

        return false;
    }

    // endregion
}


