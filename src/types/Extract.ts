import type { Attachment } from 'airtable';

export interface RawExtract {
	id: string;
	childTitles?: string[];
	children?: string[];
	connectionTitles?: string[];
	connections?: string[];
	creatorNames?: string[];
	creators?: string[];
	extract?: string;
	extractedOn: string;
	imageCaption?: string;
	images?: Attachment[];
	lastUpdated: string;
	michelinStars?: number;
	notes?: string;
	numChildren: number;
	numFragments: number;
	parent?: string[];
	parentCreatorIds?: string[];
	parentCreatorNames?: string[];
	parentTitle?: string[];
	source?: string;
	spaceTopics?: string[];
	spaces?: string[];
	title?: string;
	format?: string;
	[key: string]: unknown;
}

export interface Extract {
	id: string;
	title?: string;
	creators?: Record<string, string>[];
	spaces?: Record<string, string>[];
	connections?: Record<string, string>[];
	parent?: Record<string, string>;
	parentCreators?: Record<string, string>[];
	children?: Record<string, string>[];
	extract?: string;
	notes?: string;
	images?: Attachment[];
	imageCaption?: string;
	michelinStars?: number;
	numChildren: number;
	numFragments: number;
	source?: string;
	format?: string;
	extractedOn: Date;
	lastUpdated: Date;
	_original: RawExtract;
}
