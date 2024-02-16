import type { Attachment } from 'airtable';
import type { LinkedRecord } from './LinkedRecord';

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
	creators?: LinkedRecord[];
	spaces?: LinkedRecord[];
	connections?: LinkedRecord[];
	parent?: LinkedRecord;
	parentCreators?: LinkedRecord[];
	children?: LinkedRecord[];
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
