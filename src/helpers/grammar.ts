const vowels = ['a', 'e', 'i', 'o', 'u'];

const isFirstLetterAVowel = (str = '') => {
	const firstLetter = str[0]?.toLowerCase();
	return vowels.includes(firstLetter);
};

const article = (str: string) => (isFirstLetterAVowel(str) ? 'An' : 'A');

export { isFirstLetterAVowel, article };
