const isFirstLetterAVowel = (str = '') => {
	if (str.length <= 0) return false;
	else {
		const firstLetter = str[0].toLowerCase();
		const vowels = ['a', 'e', 'i', 'o', 'u'];
		if (vowels.indexOf(firstLetter) >= 0) {
			return true;
		} else {
			return false;
		}
	}
};

const article = (str) => (isFirstLetterAVowel(str) ? 'An' : 'A');

export default isFirstLetterAVowel;
export { article };
