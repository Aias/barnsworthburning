import zip from './zip';

const mapExtract = (extract = {}) => {
	const {
		creators,
		creatorNames,
		parent: parents,
		parentTitle: parentTitles,
		parentCreators,
		parentCreatorNames,
		spaces,
		spaceTopics,
		children,
		childTitles,
		connections,
		connectionTitles,
		...rest
	} = extract;

	const _creators = zip(['id', 'name'], creators, creatorNames);
	const _parentCreators = zip(['id', 'name'], parentCreators, parentCreatorNames);
	const _spaces = zip(['id', 'name'], spaces, spaceTopics);
	const _parents = zip(['id', 'name'], parents, parentTitles);
	const _children = zip(['id', 'name'], children, childTitles);
	const _connections = zip(['id', 'name'], connections, connectionTitles);

	return {
		...extract,
		creators: _creators,
		parentCreators: _parentCreators,
		spaces: _spaces,
		parent: _parents?.[0],
		children: _children,
		connections: _connections
	};
};

export { mapExtract };
