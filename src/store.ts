import { reactive } from 'vue';

export interface User {
  name: string;
  role: 'student' | 'admin';
  coins: number;
}

export interface State {
  currentUser: User;
  users: User[];
  exercises: string[];
  unlockedExercises: number;
}

export const state = reactive<State>({
  currentUser: {
    name: 'Admin',
    role: 'admin',
    coins: 0,
  },
  users: [
    { name: 'Student 1', role: 'student', coins: 0 },
    { name: 'Student 2', role: 'student', coins: 0 },
    { name: 'Student 3', role: 'student', coins: 0 },
    { name: 'Student 4', role: 'student', coins: 0 },
    { name: 'Student 5', role: 'student', coins: 0 },
    { name: 'Student 6', role: 'student', coins: 0 },
    { name: 'Student 7', role: 'student', coins: 0 },
    { name: 'Student 8', role: 'student', coins: 0 },
    { name: 'Student 9', role: 'student', coins: 0 },
    { name: 'Student 10', role: 'student', coins: 0 }
  ],
  exercises: [],
  unlockedExercises: 1,
});
