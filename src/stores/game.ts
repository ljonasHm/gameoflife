import { ref } from 'vue';
import { defineStore } from "pinia"
import { Game } from '@/services/Game';

export const useGameStore = defineStore('game', () => {
    const game = ref(new Game(40, 40));

    return { game };
})