<script setup>

const props = defineProps({
    filled: {
        type: Boolean
    },
    filledColor: {
        type: String
    }
});

</script>

<template>
    <div class="game__cell" :style="{background: props.filled ? props.filledColor : ''}"></div>
</template>