import { writable } from 'svelte/store';

let hourOfDay = new Date().getHours;
let isSleepingTime = hourOfDay <= 6 || hourOfDay >= 20;

const isDarkMode = writable(isSleepingTime);

export { isDarkMode };
