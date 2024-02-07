import zip from './zip';

// Define a typescript interface for the record object
// export interface Extract {
// 	children: [string, string][];
// 	connections: [string, string][];
// 	creators: [string, string][];
// 	extract: string;
// 	extractedOn: Date;
// 	id: string;
// 	imageCaption: string;
// 	images: string[];
// 	isWork: number;
// 	lastUpdated: Date;
// 	michelinStars: number;
// 	notes: string;
// 	numChildren: number;
// 	numFragments: number;
// 	parent: [string, string];
// 	parentCreators: [string, string][];
// 	source: string;
// 	spaces: [string, string][];
// 	title: string;
// 	type: string;
// }

export const mapExtractRecord = (record = {}) => {
	const {
		childTitles,
		children,
		connectionTitles,
		connections,
		creatorNames,
		creators,
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
		parent,
		parentCreatorIds,
		parentCreatorNames,
		parentTitle,
		source,
		spaceTopics,
		spaces,
		title,
		type
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
		type
	};
};
