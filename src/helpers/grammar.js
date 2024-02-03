const isFirstLetterAVowel = (str = '') => {
	const firstLetter = str[0]?.toLowerCase();
	const vowels = ['a', 'e', 'i', 'o', 'u'];
	return vowels.includes(firstLetter);
};

const article = (str) => (isFirstLetterAVowel(str) ? 'An' : 'A');

export { isFirstLetterAVowel, article };
