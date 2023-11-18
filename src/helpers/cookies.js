export function getCookie(name) {
	let cookieArr = document.cookie.split(';');
	for (let i = 0; i < cookieArr.length; i++) {
		let cookiePair = cookieArr[i].split('=').map((cookie) => cookie.trim());

		if (name == cookiePair[0]) {
			return decodeURIComponent(cookiePair[1]);
		}
	}
	// Return null if the cookie by name does not exist
	return null;
}

export function setCookie(name, value) {
	let expires = 'Fri, 31 Dec 9999 23:59:59 GMT';
	document.cookie = `${name}=${value || ''}; expires=${expires}; path=/`;
}
