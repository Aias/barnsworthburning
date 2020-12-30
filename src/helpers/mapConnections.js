import sortByFrequency from './sortbyFrequency';

const mapConnections = (commaJoinedString = '', self = '') => {
	if (!commaJoinedString) return null;

	const arr = commaJoinedString
		.split(',')
		.map((s) => s.trim())
		.filter((d) => d !== self);

	return sortByFrequency(arr);
};

export default mapConnections;
