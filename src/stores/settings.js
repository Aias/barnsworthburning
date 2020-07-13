import { writable, readable } from 'svelte/store';
import get from '../helpers/get';

// --------------------------------------
// Site mode
// --------------------------------------

let hourOfDay = new Date().getHours();
let isSleepingTime = hourOfDay <= 6 || hourOfDay >= 20;

const isDarkMode = writable(false); // Always start in day theme until I can figure out how to prevent flash of opposite mode.

// --------------------------------------
// User connection quality.
// See https://css-tricks.com/weekly-platform-news-improving-ux-on-slow-connections-a-tip-for-writing-alt-text-and-a-polyfill-for-the-html-loading-attribute/
// --------------------------------------

const isSlowConnection = () => {
	try {
		let connection = navigator.connection;

		let rtt = get(connection, 'rtt', 0);
		let effectiveType = get(connection, 'effectiveType', '');

		if (rtt > 500 || effectiveType.includes('2g')) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		// Browser does not support navigator.connection.
		return null;
	}
};

const connectionQuality = readable(isSlowConnection(), (set) => {
	const interval = setInterval(() => {
		set(isSlowConnection());
	}, 15000);

	return () => clearInterval(interval);
});

// --------------------------------------
// Site mode
// --------------------------------------

const loading = writable(false);

// --------------------------------------
// Exports
// --------------------------------------

export { isDarkMode, connectionQuality, loading };
