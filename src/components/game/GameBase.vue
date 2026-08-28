<script setup>

import { ref } from 'vue'
import { watch } from 'vue';
import GameCell from '@/components/game/GameCell.vue';
import { useGameStore } from '@/stores/game';
import { storeToRefs } from 'pinia';

const gameStore = useGameStore();

const props = defineProps({
    multiplay: {
        type: Boolean
    }
})

const { game } = storeToRefs(gameStore);

gameStore.initGame(props.multiplay);

const createCellsFromBoard = () => {
    return Array.from({ length: game.value.height }, (_, y) =>
        Array.from({ length: game.value.width }, (_, x) => ref(game.value.board[y][x]))
    );
};

const syncCellsFromBoard = () => {
    cells.value.forEach((row, heightIndex) => {
        row.forEach((cell, widthIndex) => {
            cell.value = game.value.board[heightIndex][widthIndex];
        });
    });
};

const cells = ref(createCellsFromBoard());

let stopBoardWatcher = () => {};

const start = () => {
    game.value.setBoard(Array.from(cells.value, (row, heightIndex) => Array.from(row, (_, widthIndex) => cells.value[heightIndex][widthIndex].value)));

    stopBoardWatcher();

    stopBoardWatcher = watch(() => game.value.board, () => {
        syncCellsFromBoard();
    });

    game.value.start();
}

const fillRandomly = () => {
    game.value.fillRandomly(game.value.randomFillPercentage);
    syncCellsFromBoard();
}

const passTurn = () => {
    game.value.passTurn();
}

const reset = () => {
    stopBoardWatcher();
    game.value.reset();
    syncCellsFromBoard();
}

const clear = () => {
    stopBoardWatcher();
    game.value.resetBoard();
    syncCellsFromBoard();
}

watch(() => [game.value.height, game.value.width], () => {
    stopBoardWatcher();
    game.value.resetBoard();
    cells.value = createCellsFromBoard();
})

const onCellClick = (x, y) => {
    cells.value[y][x].value = game.value.cellClick(x, y);
}

const getCellFilled = (value) => {
    if (value === 4) {
        return false;
    }

    if (value === 1 || value === 3) {
        return true;
    }

    return !game.value.started && (value === 0 || value === 2);
}

const getCellColor = (value) => {
    if (value === 1) {
        return game.value.filledCellColor;
    }

    if (value === 3) {
        return game.value.filledCellColor2;
    }

    if (!game.value.started && value === 0) {
        return game.value.fieldCellColor;
    }

    if (!game.value.started && value === 2) {
        return game.value.fieldCellColor2;
    }

    return '';
}

const getCellHoverColor = (value) => {
    if (value === 4) {
        return '';
    }

    if (value === 1 || value === 0) {
        return game.value.hoverCellColor;
    }

    if (value === 3 || value === 2) {
        return game.value.hoverCellColor2;
    }

    return game.value.hoverCellColor;
}

const getCellSpecialClass = (value) => {
    return value === 4 ? 'game__cell--neutral' : '';
}

</script> 

<template>
    <div class="game">
        <div class="game__field">
            <div v-for="(row, y) in cells" :key="y" class="game__row">
                <GameCell v-for="(cell, x) in row" @click="onCellClick(x, y)" 
                    :filled="getCellFilled(cell?.value)"
                    :filled-color="getCellColor(cell?.value)"
                    :hover-color="getCellHoverColor(cell?.value)"
                    :special-class="getCellSpecialClass(cell?.value)"
                    :key="x" />
            </div>
        </div>
        <div class="mt-3 flex justify-center gap-2">
            <div>Iteration: {{ game.iteration }}</div>
            <div v-if="multiplay">
                P1: {{ game.aliveCellsCountP1 }} / P2: {{ game.aliveCellsCountP2 }}
            </div>
            <div v-else>Alive cells: {{ game.aliveCellsCount }}</div>
            <div v-if="multiplay && !game.started">Player {{ game.activeUserIndex + 1 }} turn</div>
        </div>
        <div class="mt-3 flex justify-center gap-2">
            <template v-if="!game.started">
                <button @click="fillRandomly" class="common-button">Fill randomly {{ game.randomFillPercentage }}%</button>
                <button v-if="multiplay && game.activeUserIndex === 0" @click="passTurn" class="common-button">Pass turn</button>
                <button v-if="!multiplay || game.activeUserIndex === 1" @click="start" class="common-button">Start</button>
                <button @click="clear" class="common-button">Clear</button>
            </template>
            <template v-else-if="game.paused">
                <button @click="game.play()" class="common-button">Play ▶</button>
                <button @click="game.nextGeneration()" class="common-button">Next ></button>
                <button @click="reset" class="common-button">Reset</button>
            </template>
            <template v-else>
                <button @click="game.pause()" class="common-button">Pause ||</button>
                <button @click="reset" class="common-button">Reset</button>
            </template>
        </div>
    </div>
</template>
