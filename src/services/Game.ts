/*
    0 - empty and available, 1 - filled and available, 2 - empty and enemy, 3 - filled and enemy, 4 - neutral unavailable
*/
type CellValue = 0 | 1 | 2 | 3 | 4;
interface gameProps {
    height: number,
    width: number,
    speed: number,
    filledCellColor: string,
    filledCellColor2: string
}
interface preparedGenerationResult {
    newBoard: CellValue[][],
    aliveCellsCount: number,
    aliveCellsCountP1: number,
    aliveCellsCountP2: number
}
interface NeighborCounts {
    total: number,
    p1: number,
    p2: number
}

export class Game {

    _started: boolean = false;
    _paused: boolean = true;

    _multiplay: boolean = false;

    /*
        Индекс юзера, который может в данный момент заполнять поле (Только если игра _started === false).
    */
   
    _activeUserIndex: number = 0; 

    _iteration: number = 0;
    _aliveCellsCount: number = 0;
    _aliveCellsCountP1: number = 0;
    _aliveCellsCountP2: number = 0;

    _height: number;
    _width: number;
    _speed: number = 1;
    _randomFillPercentage: number = 50;

    _board: CellValue[][] = [[]];
    _savedBoard: CellValue[][] = [[]];
    _filledCellColor: string = '#000000';
    _filledCellColor2: string = '#A63232';

    constructor(height: number, width: number, multiplay: boolean) {
        this._height = height;
        this._width = width;
        this._multiplay = multiplay;
        this.resetBoard();
    }

    get activeUserIndex(): number {
        return this._activeUserIndex;
    }

    get multiplay(): boolean {
        return this._multiplay;
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

    get filledCellColor2(): string {
        return this._filledCellColor2;
    }

    get fieldCellColor(): string {
        return this._hexToRgba(this._filledCellColor, 0.1);
    }

    get fieldCellColor2(): string {
        return this._hexToRgba(this._filledCellColor2, 0.1);
    }

    get hoverCellColor(): string {
        return this._hexToRgba(this._filledCellColor, 0.5);
    }

    get hoverCellColor2(): string {
        return this._hexToRgba(this._filledCellColor2, 0.5);
    }

    _hexToRgba(hex: string, alpha: number): string {
        const normalized = hex.replace('#', '');
        const full = normalized.length === 3
            ? normalized.split('').map((char) => char + char).join('')
            : normalized;
        const r = parseInt(full.slice(0, 2), 16);
        const g = parseInt(full.slice(2, 4), 16);
        const b = parseInt(full.slice(4, 6), 16);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

    get aliveCellsCountP1(): number {
        return this._aliveCellsCountP1;
    }

    get aliveCellsCountP2(): number {
        return this._aliveCellsCountP2;
    }

    _recountAliveCells(): void {
        let total = 0;
        let p1 = 0;
        let p2 = 0;

        for (const row of this._board) {
            for (const cell of row) {
                if (cell === 1) {
                    total++;
                    p1++;
                } else if (cell === 3) {
                    total++;
                    p2++;
                }
            }
        }

        this._aliveCellsCount = total;
        this._aliveCellsCountP1 = p1;
        this._aliveCellsCountP2 = p2;
    }

    isCellFilled(x: number, y: number): boolean {
        const value = this._board[y][x];
        return value === 1 || value === 3;
    }

    _fill(x: number, y: number): void {
        if (this._multiplay && this._activeUserIndex === 1) {
            this._board[y][x] = 3;
        } else {
            this._board[y][x] = 1;
        }
    }

    _clear(x: number, y: number): void {
        if (this._multiplay && (this._activeUserIndex === 1 || this._board[y][x] === 3)) {
            this._board[y][x] = 2;
        } else {
            this._board[y][x] = 0;
        }
    }

    _canEditCell(x: number, y: number): boolean {
        const value = this._board[y][x];

        if (value === 4) {
            return false;
        }

        if (!this._multiplay) {
            return value === 0 || value === 1;
        }

        if (this._activeUserIndex === 0) {
            return value === 0 || value === 1;
        }

        return value === 2 || value === 3;
    }

    _fillOrClear(x: number, y: number): CellValue {
        if (!this._canEditCell(x, y)) {
            return this._board[y][x];
        }

        if (this.isCellFilled(x, y)) {
            this._clear(x, y);
        } else {
            this._fill(x, y);
        }

        this._recountAliveCells();
        return this._board[y][x];
    }

    _prepareNextGeneration(): preparedGenerationResult {
        const newBoard: CellValue[][] = Array.from({ length: this._height }, () => Array.from({ length: this._width }, () => 0 as CellValue));
        let aliveCellsCount = 0;
        let aliveCellsCountP1 = 0;
        let aliveCellsCountP2 = 0;

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                const neighbors = this._countAliveNeighbors(x, y);
                const cell = this._board[y][x];
                const isAlive = cell === 1 || cell === 3;

                if (!isAlive && neighbors.total === 3) {
                    const next = neighbors.p1 > neighbors.p2 ? 1 : 3;
                    newBoard[y][x] = next;
                    aliveCellsCount++;
                    if (next === 1) {
                        aliveCellsCountP1++;
                    } else {
                        aliveCellsCountP2++;
                    }
                } else if (isAlive && (neighbors.total === 2 || neighbors.total === 3)) {
                    const next = this._resolveSurvivingOwner(cell, neighbors);
                    newBoard[y][x] = next;
                    aliveCellsCount++;
                    if (next === 1) {
                        aliveCellsCountP1++;
                    } else {
                        aliveCellsCountP2++;
                    }
                }
            }
        }

        return {
            newBoard,
            aliveCellsCount,
            aliveCellsCountP1,
            aliveCellsCountP2
        };
    }

    _resolveSurvivingOwner(cell: CellValue, neighbors: NeighborCounts): CellValue {
        const isPlayer1 = cell === 1;
        const opponentCount = isPlayer1 ? neighbors.p2 : neighbors.p1;

        if (neighbors.total === 2 && opponentCount === 2) {
            return isPlayer1 ? 3 : 1;
        }

        if (neighbors.total === 3 && opponentCount === 3) {
            return isPlayer1 ? 3 : 1;
        }

        return isPlayer1 ? 1 : 3;
    }

    _countAliveNeighbors(x: number, y: number): NeighborCounts {
        let p1 = 0;
        let p2 = 0;

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue;
                const ny = y + dy;
                const nx = x + dx;
                if (ny >= 0 && ny < this._height && nx >= 0 && nx < this._width) {
                    const value = this._board[ny][nx];
                    if (value === 1) {
                        p1++;
                    } else if (value === 3) {
                        p2++;
                    }
                }
            }
        }

        return {
            total: p1 + p2,
            p1,
            p2
        };
    }

    cellClick(x: number, y: number): CellValue {
        if (this._started) {
            return this._board[y][x];
        }

        return this._fillOrClear(x, y);
    }

    passTurn(): void {
        if (!this._started && this._multiplay && this._activeUserIndex === 0) {
            this._activeUserIndex = 1;
        }
    }

    fillRandomly(percentage: number): void {
        if (!this._multiplay) {
            this.resetBoard();
        }

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                const value = this._board[y][x];

                if (value === 4) {
                    continue;
                }

                if (this._multiplay) {
                    const isPlayer1Cell = value === 0 || value === 1;
                    const isPlayer2Cell = value === 2 || value === 3;

                    if (this._activeUserIndex === 0 && !isPlayer1Cell) {
                        continue;
                    }

                    if (this._activeUserIndex === 1 && !isPlayer2Cell) {
                        continue;
                    }

                    this._board[y][x] = this._activeUserIndex === 1 ? 2 : 0;
                }

                if (percentage >= Math.random() * 100) {
                    if (this._multiplay && this._activeUserIndex === 1) {
                        this._board[y][x] = 3;
                    } else {
                        this._board[y][x] = 1;
                    }
                }
            }
        }

        this._recountAliveCells();
    }

    setBoard(newBoard: CellValue[][]): void {
        this._board = newBoard;
    }

    start(): void {
        if (this._started) {
            return;
        }

        if (this._multiplay && this._activeUserIndex !== 1) {
            return;
        }

        this._savedBoard = this._board.map((row) => [...row]);
        this._started = true;
    }

    nextGeneration(): void {
        if (this._started) {
            const nextGeneration = this._prepareNextGeneration();
            this._board = nextGeneration.newBoard;
            this._aliveCellsCount = nextGeneration.aliveCellsCount;
            this._aliveCellsCountP1 = nextGeneration.aliveCellsCountP1;
            this._aliveCellsCountP2 = nextGeneration.aliveCellsCountP2;
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
        /*
            resetBoard для мультиплеера наполовину заполняет половину ширины поля значениями 0, а вторую половину значениями 2.
            При нечётном значении заполняет среднюю колонну значением 4 (недоступным для всех со старта).
        */
        if (this._multiplay) {
            const half = Math.floor(this._width / 2);
            const hasNeutral = this._width % 2 === 1;

            this._board = Array.from({ length: this._height }, () => Array.from({ length: this._width }, (_, index) => {
                if (hasNeutral && index === half) {
                    return 4 as CellValue;
                }

                if (index >= (hasNeutral ? half + 1 : half)) {
                    return 2 as CellValue;
                }

                return 0 as CellValue;
            }));
        } else {
            this._board = Array.from({ length: this._height }, () => Array.from({ length: this._width }, () => 0 as CellValue));
        }

        this._aliveCellsCount = 0;
        this._aliveCellsCountP1 = 0;
        this._aliveCellsCountP2 = 0;
        this._iteration = 0;
        this._activeUserIndex = 0;
    }

    reset(): void {
        this._started = false;
        this._paused = true;
        this._board = this._savedBoard.map((row) => [...row]);
        this._activeUserIndex = 0;
        this._iteration = 0;
        this._recountAliveCells();
    }

    setProps(props: gameProps): void {
        this._filledCellColor = props.filledCellColor;
        this._filledCellColor2 = props.filledCellColor2;
        this._speed = props.speed;

        if (!this._started) {
            const sizeChanged = this._height !== props.height || this._width !== props.width;
            this._height = props.height;
            this._width = props.width;

            if (sizeChanged) {
                this.resetBoard();
            }
        }
    }
}
