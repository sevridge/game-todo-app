import { LazyStore } from '@tauri-apps/plugin-store';

export const tasksStore = new LazyStore('tasks.json');
export const gamesStore = new LazyStore('games.json');