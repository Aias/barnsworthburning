import zip from './zip';
import type { RawExtract, Extract } from '../types/Extract';

export const mapExtractRecord = (record: RawExtract): Extract => {
	const {
		childTitles = [],
		children = [],
		connectionTitles = [],
		connections = [],
		creatorNames = [],
		creators = [],
		extract,
		extractedOn,
		id,
		imageCaption,
		images,
		isWork,
		lastUpdated,
		michelinStars,
		notes,
		numChildren,
		numFragments,
		parent = [],
		parentCreatorIds = [],
		parentCreatorNames = [],
		parentTitle = [],
		source,
		spaceTopics = [],
		spaces = [],
		title,
		format
	} = record;

	return {
		children: zip(['id', 'name'], children, childTitles),
		connections: zip(['id', 'name'], connections, connectionTitles),
		creators: zip(['id', 'name'], creators, creatorNames),
		extract,
		extractedOn: new Date(extractedOn),
		id,
		imageCaption,
		images,
		isWork,
		lastUpdated: new Date(lastUpdated),
		michelinStars,
		notes,
		numChildren,
		numFragments,
		parent: zip(['id', 'name'], parent, parentTitle),
		parentCreators: zip(['id', 'name'], parentCreatorIds, parentCreatorNames),
		source,
		spaces: zip(['id', 'name'], spaces, spaceTopics),
		title,
		format,
		original: record
	};
};
