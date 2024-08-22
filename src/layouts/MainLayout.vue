<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Gamification Math App
        </q-toolbar-title>

        <q-space />

        <div class="row items-center q-gutter-sm">
          <q-avatar color="primary" text-color="white">{{ currentUserInitial }}</q-avatar>
          <q-badge color="primary" text-color="white">
            <q-icon name="monetization_on" /> {{ state.currentUser.coins }}
          </q-badge>
          <q-btn-dropdown color="primary" label="Switch">
            <q-list>
              <q-item clickable v-for="user in state.users" :key="user.name" v-close-popup @click="switchUser(user)">
                <q-item-section>
                  <q-item-label>{{ user.name }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="switchUser(admin)">
                <q-item-section>
                  <q-item-label>Admin</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          Pages
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, provide, onMounted } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import { state, User } from '../store';

defineOptions({
  name: 'MainLayout'
});

const linksList: EssentialLinkProps[] = [
  {
    title: 'Student Page',
    caption: 'View exercises',
    icon: 'school',
    link: '/student'
  },
  {
    title: 'Admin Page',
    caption: 'Create new exercises',
    icon: 'edit',
    link: '/admin'
  }
];

const leftDrawerOpen = ref(false);

const currentUserInitial = computed(() => state.currentUser.name.charAt(0));

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const admin: User = { name: 'Admin', role: 'admin', coins: 0 };

function switchUser(user: User) {
  state.currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
}

// Provide the state to all children
provide('state', state);

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
});
</script>
