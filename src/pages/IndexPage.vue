<template>
  <q-page class="q-pa-md">
    <h4 class="text-center">Available Exercises</h4>
    <q-list>
      <q-item v-for="(exercise, index) in state.exercises" :key="index" class="exercise-item">
        <q-card flat bordered class="q-mb-md exercise-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-h6">
                <q-avatar v-if="index < state.unlockedExercises" icon="check_circle" color="green" />
                <q-avatar v-else icon="lock" color="red" />
                Exercise {{ index + 1 }}
              </div>
              <q-badge v-if="index >= state.unlockedExercises" color="primary" text-color="white">
                {{ unlockCost }} <q-icon name="monetization_on" />
              </q-badge>
            </div>
          </q-card-section>

          <q-card-section v-if="index < state.unlockedExercises">
            <div v-html="renderExercise(exercise)"></div>
          </q-card-section>

          <q-card-section v-else>
            <div class="blurred" v-html="renderExercise(exercise)"></div>
            <q-btn color="primary" @click="unlockExercise()" :disable="state.currentUser.coins < unlockCost" label="Unlock" class="q-mt-md" />
          </q-card-section>
        </q-card>
      </q-item>
    </q-list>

    <div class="q-mt-md" v-if="state.currentUser.role === 'admin'">
      <h4 class="text-center">Manage Students</h4>
      <q-table :rows="state.users" :columns="columns" row-key="name">
        <template v-slot:body-cell-give-money="props">
          <q-td :props="props">
            <q-btn color="primary" @click="giveMoney(props.row, 5)" label="Give 5 Coins" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { QPage, QCard, QCardSection, QBtn, QAvatar, QList, QItem, QBadge, QIcon, QTable, QTd } from 'quasar';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { state, User } from '../store'; // Import the State type

const unlockCost = 5;

// Define a type for the columns
interface Column {
  name: string;
  label: string;
  field: string | ((row: User) => string | number);
  required?: boolean;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  format?: (val: string) => string;
}

const columns: Column[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row: User) => row.name,
    format: (val: string) => `${val}`,
    sortable: true,
  },
  {
    name: 'coins',
    label: 'Coins',
    align: 'right',
    field: (row: User) => row.coins,
    sortable: true,
  },
  {
    name: 'give-money',
    label: 'Give Money',
    align: 'right',
    field: 'give-money',
  },
];

const unlockExercise = () => {
  if (state.currentUser.coins >= unlockCost) {
    state.currentUser.coins -= unlockCost;
    state.unlockedExercises += 1;
    saveUser();
    saveUnlockedExercises();
  }
};

const giveMoney = (student: User, amount: number) => {
  student.coins += amount;
  saveUsers();
};

const saveUser = () => {
  localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
};

const saveUnlockedExercises = () => {
  localStorage.setItem('unlockedExercises', JSON.stringify(state.unlockedExercises));
};

const saveUsers = () => {
  localStorage.setItem('users', JSON.stringify(state.users));
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

// Load exercises and user data from localStorage on mount
onMounted(() => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    Object.assign(state.currentUser, JSON.parse(storedUser));
  }

  const storedExercises = localStorage.getItem('exercises');
  if (storedExercises) {
    state.exercises = JSON.parse(storedExercises);
  }

  const storedUnlockedExercises = localStorage.getItem('unlockedExercises');
  if (storedUnlockedExercises) {
    state.unlockedExercises = JSON.parse(storedUnlockedExercises);
  }

  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    state.users = JSON.parse(storedUsers);
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
.exercise-item {
  display: flex;
  justify-content: center;
}
.exercise-card {
  width: 100%;
  max-width: 800px;
}
.blurred {
  filter: blur(4px);
  pointer-events: none;
}
</style>
