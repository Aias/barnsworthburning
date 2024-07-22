// Adapted from:
// https://chriscoyier.net/2023/01/19/dark-mode-via-a-smallish-script-in-the-head-avoiding-fart/

const COOKIES = {
	MODE: 'barnsworthburning-mode',
	CHROMA: 'barnsworthburning-chroma',
	PALETTE: 'barnsworthburning-palette'
};

const DEFAULTS = {
	MODE: 'auto',
	CHROMA: 'neutral',
	PALETTE: 'indigo'
};

function getCookie(name) {
	return (
		document.cookie
			.split(';')
			.find((c) => c.trim().startsWith(name + '='))
			?.split('=')[1]
			.trim() || null
	);
}

function setClass(key) {
	const value = getCookie(COOKIES[key]) || DEFAULTS[key];
	document.documentElement.classList.add(value);
}

setClass('MODE');
setClass('CHROMA');
setClass('PALETTE');
