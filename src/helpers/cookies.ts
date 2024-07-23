export function getCookie<T = string>(name: string): T | undefined {
	if (typeof document === 'undefined') {
		// We're on the server, return undefined.
		return undefined;
	}

	const cookieArr = document.cookie.split(';');
	for (let i = 0; i < cookieArr.length; i++) {
		const cookiePair = cookieArr[i].split('=').map((cookie) => cookie.trim());

		if (name == cookiePair[0]) {
			return decodeURIComponent(cookiePair[1]) as T;
		}
	}
	// Return undefined if the cookie by name does not exist.
	return undefined;
}

export function setCookie(name: string, value: string) {
	if (typeof document === 'undefined') {
		// We're on the server, do nothing.
		return;
	}

	const expires = 'Fri, 31 Dec 9999 23:59:59 GMT';
	document.cookie = `${name}=${value || ''}; expires=${expires}; path=/`;
}
