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
	isWork: number;
	lastUpdated: string;
	michelinStars: number;
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
	children?: Record<string, string>[];
	connections?: Record<string, string>[];
	creators?: Record<string, string>[];
	extract?: string;
	extractedOn: Date;
	imageCaption?: string;
	images?: Attachment[];
	isWork: number;
	lastUpdated: Date;
	michelinStars: number;
	notes?: string;
	numChildren: number;
	numFragments: number;
	parent?: Record<string, string>[];
	parentCreators?: Record<string, string>[];
	source?: string;
	spaces?: Record<string, string>[];
	title?: string;
	format?: string;
	original: RawExtract;
}
