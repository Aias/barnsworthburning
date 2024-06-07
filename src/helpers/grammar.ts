const vowels = ['a', 'e', 'i', 'o', 'u'];

export const isFirstLetterAVowel = (str = '') => {
	const firstLetter = str[0]?.toLowerCase();
	return vowels.includes(firstLetter);
};

export const getArticle = (str: string) => (isFirstLetterAVowel(str) ? 'An' : 'A');

export const capitalize = (string?: string) => {
	if (!string) return string;
	return string.charAt(0).toUpperCase() + string.slice(1);
};
