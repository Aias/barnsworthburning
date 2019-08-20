import { writable } from 'svelte/store';

let hourOfDay = new Date().getHours();
let isSleepingTime = hourOfDay <= 6 || hourOfDay >= 20;

let isDarkMode = writable(false); // Always start in day theme until I can figure out how to prevent flash of opposite mode.

export { isDarkMode };
