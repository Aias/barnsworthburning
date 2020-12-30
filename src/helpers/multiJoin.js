export default (arr = []) => {
	const num = arr.length;
	if (num === 0) {
		return '';
	} else if (num === 1) {
		return arr[0];
	} else if (num === 2) {
		return arr.join(' & ');
	} else {
		return arr.slice(0, num - 1).join(', ') + ` & ${arr[num - 1]}`;
	}
};
