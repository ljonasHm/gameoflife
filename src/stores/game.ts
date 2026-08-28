import { ref } from 'vue';
import { defineStore } from "pinia"
import { Game } from '@/services/Game';

export const useGameStore = defineStore('game', () => {
    const game = ref<Game | null>(null);
    const isGameInited = ref<boolean>(false);

    const initGame = (multiplay: boolean) => {
        game.value = new Game(50, 50, multiplay);
        isGameInited.value = true;
    }

    return { game, initGame, isGameInited };
})