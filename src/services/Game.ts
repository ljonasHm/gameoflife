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
    _filledCellColor: string = '#000000';

    constructor(height: number, width: number) {
        this._height = height;
        this._width = width;
        this._resetBoard();
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

    _fillOrClear(x: number, y: number): void {
        if (this.isCellFilled(x, y)) {
            this._clear(x, y);
        } else {
            this._fill(x, y);
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

    cellClick(x: number, y: number): void {
        if (this._started) {
            return;
        }

        this._fillOrClear(x, y);
    }

    fillRandomly(percentage: number): void {
        const totalCells = this._height * this._width;
        const cellsToFill = Math.floor((percentage / 100) * totalCells);
        let filledCells = 0;

        this._resetBoard();

        while (filledCells < cellsToFill) {
            const y = Math.floor(Math.random() * this._height);
            const x = Math.floor(Math.random() * this._width);
            if (!this.isCellFilled(x, y)) {
                this._fill(x, y);
                filledCells++;
            }
        }
    }

    setBoard(newBoard: CellValue[][]): void {
        this._board = newBoard;
    }

    start(): void {
        if (!this._started) {
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

    _resetBoard(): void {
        this._board = Array.from({ length: this._height }, () => Array.from({ length: this._width }, () => 0 as CellValue));
    }

    reset(): void {
        this._started = false;
        this._paused = true;
        this._resetBoard();
    }

    setProps(props: gameProps): void {
        this._height = props.height;
        this._width = props.width;
        this._speed = props.speed;
        this._resetBoard();
    }
}