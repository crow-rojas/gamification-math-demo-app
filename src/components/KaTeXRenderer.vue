<template>
  <span v-if="inline" ref="katexContainer" />
  <div v-else ref="katexContainer" />
</template>

<script setup lang="ts">
import { onMounted, watch, ref, defineProps } from 'vue';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const props = defineProps({
  formula: {
    type: String,
    required: true
  },
  inline: {
    type: Boolean,
    default: false
  }
});

const katexContainer = ref(null);

const renderKaTeX = () => {
  if (katexContainer.value) {
    katex.render(
      props.formula,
      katexContainer.value,
      {
        throwOnError: false,
        displayMode: !props.inline
      }
    );
  }
};

onMounted(() => {
  renderKaTeX();
});

watch(() => props.formula, () => {
  renderKaTeX();
});
</script>
