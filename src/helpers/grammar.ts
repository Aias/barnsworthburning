const vowels = ['a', 'e', 'i', 'o', 'u'];

export const isFirstLetterAVowel = (str = '') => {
	const firstLetter = str[0]?.toLowerCase();
	return vowels.includes(firstLetter);
};

export const getArticle = (str: string) => (isFirstLetterAVowel(str) ? 'An' : 'A');

export const capitalize = (string?: string) => {
	if (!string) return '';
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const toTitleCase = (str: string) => str.toLowerCase().replace(/\b\w+\b/g, capitalize);

export const combineAsList = (arr: string[], transformer?: (txt: string) => string) => {
	const mapped = transformer ? arr.map(transformer) : arr;
	if (mapped.length <= 1) return mapped[0] ?? '';
	return mapped.slice(0, -1).join(', ') + ' & ' + mapped.at(-1);
};
