<script setup>

import { ref, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
    }
})

const show = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

const content = ref(null);

onClickOutside(content, () => {
    show.value = false;
})

</script>

<template>
    <Teleport to="body">
        <transition name="fade">
            <div v-if="show" class="pop-up">
                <div class="pop-up__overlay"></div>
                <div class="pop-up__content" ref="content">
                    <div class="pop-up__title">{{ title }}</div>
                    <slot></slot>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<style>

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease-in;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.fade-enter-active .pop-up__content, .fade-leave-active .pop-up__content {
    transition: transform .2s ease-in;
}

.fade-enter-from .pop-up__content,
.fade-leave-to .pop-up__content {
    transform: translateX(50%);
}

</style>