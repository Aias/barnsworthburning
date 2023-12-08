export const mapIndex = (creators = [], spaces = []) => {
	let creatorMap = creators.map(({ name, id, numExtracts, lastUpdated, ...creator }) => ({
		id,
		type: 'creator',
		label: name,
		count: numExtracts,
		time: new Date(lastUpdated)
	}));
	let spacesMap = spaces.map(({ topic, id, numExtracts, lastUpdated, ...space }) => ({
		id,
		type: 'space',
		label: topic,
		count: numExtracts,
		time: new Date(lastUpdated)
	}));

	return creatorMap.concat(spacesMap);
};
