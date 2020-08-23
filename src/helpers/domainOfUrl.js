export default (url = '') => {
	return new URL(url).hostname;
};
