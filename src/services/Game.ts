type CellValue = 0 | 1 | 2;
interface gameProps {
    height: number,
    width: number,
    speed: number
}
interface preparedGenerationResult {
    newBoard: CellValue[][],
    aliveCellsCount: number
}

export class Game {

    _started: boolean = false;
    _paused: boolean = true;

    _iteration: number = 0;
    _aliveCellsCount: number = 0;

    _height: number;
    _width: number;
    _speed: number = 1;
    _randomFillPercentage: number = 50;

    _board: CellValue[][] = [[]];
    _savedBoard: CellValue[][] = [[]];
    _filledCellColor: string = '#000000';

    constructor(height: number, width: number) {
        this._height = height;
        this._width = width;
        this.resetBoard();
    }

    get height(): number {
        return this._height;
    }

    get width(): number {
        return this._width;
    }

    get speed(): number {
        return this._speed;
    }

    get board(): CellValue[][] {
        return this._board;
    }

    get started(): boolean {
        return this._started;
    }

    get paused(): boolean {
        return this._paused;
    }

    get filledCellColor(): string {
        return this._filledCellColor;
    }

    get randomFillPercentage(): number {
        return this._randomFillPercentage;
    }

    get iteration(): number {
        return this._iteration;
    }

    get aliveCellsCount(): number {
        return this._aliveCellsCount;
    }

    isCellFilled(x: number, y: number): boolean {
        return this._board[y][x] === 1;
    }

    _fill(x: number, y: number): void {
        this._board[y][x] = 1;
    }

    _clear(x: number, y: number): void {
        this._board[y][x] = 0;
    }

    _fillOrClear(x: number, y: number): boolean {
        if (this.isCellFilled(x, y)) {
            this._clear(x, y);
            this._aliveCellsCount--;
            return false;
        } else {
            this._fill(x, y);
            this._aliveCellsCount++;
            return true;
        }
    }

    _prepareNextGeneration(): preparedGenerationResult {
        const newBoard: CellValue[][] = Array.from({ length: this._height }, () => Array.from({ length: this._width }, () => 0 as CellValue));
        let aliveCellsCount = 0;

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                const aliveNeighbors = this._countAliveNeighbors(x, y);

                if (this._board[y][x] === 1 && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
                    aliveCellsCount++;
                    newBoard[y][x] = 1;
                } else if (this._board[y][x] === 0 && aliveNeighbors === 3) {
                    aliveCellsCount++;
                    newBoard[y][x] = 1;
                }
            }
        }

        return {
            newBoard,
            aliveCellsCount
        };
    }

    _countAliveNeighbors(x: number, y: number): number {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue; // Skip the cell itself
                const ny = y + dy;
                const nx = x + dx;
                if (ny >= 0 && ny < this._height && nx >= 0 && nx < this._width) {
                    count += this._board[ny][nx] === 1 ? 1 : 0;
                }
            }
        }
        return count;
    }

    cellClick(x: number, y: number): boolean {
        if (this._started) {
            return false;
        }

        return this._fillOrClear(x, y);
    }

    fillRandomly(percentage: number): void {
        let filledCells = 0;
        this.resetBoard();

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                if (percentage >= Math.random() * 100) {
                    this._fill(x, y);
                    filledCells++;
                }
            }
        }

        this._aliveCellsCount = filledCells;
    }

    setBoard(newBoard: CellValue[][]): void {
        this._board = newBoard;
    }

    start(): void {
        if (!this._started) {
            this._savedBoard = this._board;
            this._started = true;
        }
    }

    nextGeneration(): void {
        if (this._started) {
            const nextGeneration = this._prepareNextGeneration();
            this._board = nextGeneration.newBoard;
            this._aliveCellsCount = nextGeneration.aliveCellsCount;
            this._iteration++;
        }
    }

    _playNextGeneration(): void {
        if (this._started && !this._paused) {
            this.nextGeneration();
            setTimeout(() => this._playNextGeneration(), this._speed * 1000);
        }
    }

    play(): void {
        if (this._started) {
            this._paused = false;
            this._playNextGeneration();
        }
    }

    pause(): void {
        if (this._started) {
            this._paused = true;
        }
    }

    resetBoard(): void {
        this._board = Array.from({ length: this._height }, () => Array.from({ length: this._width }, () => 0 as CellValue));
        this._aliveCellsCount = 0;
        this._iteration = 0;
    }

    reset(): void {
        this._started = false;
        this._paused = true;
        this._board = this._savedBoard;
    }

    setProps(props: gameProps): void {

        if (this._started) {
            this._speed = props.speed;
        } else {
            this._height = props.height;
            this._width = props.width;
            this._speed = props.speed;
            this.resetBoard();
        }
    }
}