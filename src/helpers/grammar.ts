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

export const toTitleCase = (str: string) => {
	// Convert the entire string to lowercase first to ensure consistency
	return str.toLowerCase().replace(/\b\w+\b/g, capitalize);
};

export const combineAsList = (arr: string[], transformer?: (txt: string) => string) => {
	const mapped = transformer ? arr.map(transformer) : arr;
	if (mapped.length === 0) {
		return ''; // Return an empty string if no elements exist
	}
	if (mapped.length === 1) {
		return arr[0]; // Return the single entry if only one element exists
	}
	const lastElement = mapped.pop(); // Remove the last element from the array
	return mapped.join(', ') + ' & ' + lastElement; // Join with commas and last with an ampersand
};
