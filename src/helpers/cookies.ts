export function getCookie(name: string): string | undefined {
	if (typeof document === 'undefined') return undefined;

	for (const pair of document.cookie.split(';')) {
		const [key, value] = pair.split('=').map((s) => s.trim());
		if (name === key) return decodeURIComponent(value);
	}

	return undefined;
}

export function setCookie(name: string, value: string) {
	if (typeof document === 'undefined') return;
	document.cookie = `${name}=${value || ''}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}
