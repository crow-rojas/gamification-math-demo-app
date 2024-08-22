<template>
  <q-page class="q-pa-md">
    <h4 class="text-center">Admin Page</h4>

    <q-card flat bordered class="q-mb-md">
      <q-card-section class="text-center">
        <h5>Add New Exercise</h5>
        <form @submit.prevent="addExercise">
          <q-editor v-model="newExerciseContent" min-height="5rem" placeholder="Type your exercise content here..." />
          <q-card flat bordered class="q-mt-md">
            <q-card-section>
              <div v-html="renderExercise(newExerciseContent)" />
            </q-card-section>
          </q-card>
          <q-btn type="submit" color="primary" label="Add Exercise" class="q-mt-md" />
        </form>
      </q-card-section>
    </q-card>

    <div v-if="state.exercises.length">
      <h4 class="text-center">Saved Exercises</h4>
      <q-list>
        <q-item v-for="(exercise, index) in state.exercises" :key="index" class="exercise-item">
          <q-card flat bordered class="q-mb-md exercise-card">
            <q-card-section>
              <div v-html="renderExercise(exercise)"></div>
            </q-card-section>
            <q-card-section class="text-center q-pt-none">
              <q-btn color="negative" @click="deleteExercise(index)" label="Delete" />
            </q-card-section>
          </q-card>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QPage, QCard, QCardSection, QBtn, QList, QItem, QEditor } from 'quasar';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { state } from '../store';

const newExerciseContent = ref('');

const addExercise = () => {
  if (newExerciseContent.value.trim()) {
    state.exercises.push(newExerciseContent.value);
    newExerciseContent.value = '';
    saveExercises();
  }
};

const deleteExercise = (index: number) => {
  state.exercises.splice(index, 1);
  saveExercises();
};

const saveExercises = () => {
  localStorage.setItem('exercises', JSON.stringify(state.exercises));
};

const renderExercise = (content: string) => {
  const blockRegex = /\$\$([^$]+)\$\$/g;
  const inlineRegex = /\$([^$]+)\$\$/g;

  // First render block LaTeX to prevent nested inline rendering
  let renderedContent = content.replace(blockRegex, (_, formula: string) => {
    return katex.renderToString(formula, { throwOnError: false, displayMode: true });
  });

  // Then render inline LaTeX
  renderedContent = renderedContent.replace(inlineRegex, (_, formula: string) => {
    return katex.renderToString(formula, { throwOnError: false, displayMode: false });
  });

  return renderedContent;
};

// Load exercises from localStorage on mount
onMounted(() => {
  const storedExercises = localStorage.getItem('exercises');
  if (storedExercises) {
    state.exercises = JSON.parse(storedExercises);
  }
});
</script>

<style scoped>
.q-page {
  max-width: 1000px;
  margin: auto;
}
.text-center {
  text-align: center;
}
.q-mb-md {
  margin-bottom: 1em;
}
.exercise-card {
  width: 100%;
  max-width: 800px;
  margin: auto;
}
</style>
