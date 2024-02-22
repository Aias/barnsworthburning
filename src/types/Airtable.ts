import type { Attachment, FieldSet, Record } from 'airtable';

type AirtableRecordId = Record<FieldSet>['id'];

export interface IBaseRecord {
	id: AirtableRecordId;
	[key: string]: FieldSet[keyof FieldSet] | ILinkedRecord[];
}

export interface ILinkedRecord {
	id: AirtableRecordId;
	name: string;
}

export interface IBaseExtract extends IBaseRecord {
	id: AirtableRecordId;
	childTitles?: string[];
	children?: AirtableRecordId[];
	connectionTitles?: string[];
	connections?: AirtableRecordId[];
	creatorNames?: string[];
	creators?: AirtableRecordId[];
	extract?: string;
	extractedOn: string;
	format?: string;
	imageCaption?: string;
	images?: Attachment[];
	lastUpdated: string;
	michelinStars?: number;
	notes?: string;
	parent?: AirtableRecordId[];
	parentCreatorIds?: AirtableRecordId[];
	parentCreatorNames?: string[];
	parentTitle?: string[];
	source?: string;
	spaceTopics?: string[];
	spaces?: AirtableRecordId[];
	title?: string;
}

export interface IExtract {
	id: string;
	title?: string;
	creators?: ILinkedRecord[];
	spaces?: ILinkedRecord[];
	connections?: ILinkedRecord[];
	parent?: ILinkedRecord;
	parentCreators?: ILinkedRecord[];
	children?: ILinkedRecord[];
	extract?: string;
	notes?: string;
	images?: Attachment[];
	imageCaption?: string;
	michelinStars?: number;
	source?: string;
	format?: string;
	extractedOn: Date;
	lastUpdated: Date;
	_original: IBaseExtract;
}

export interface IBaseCreator extends IBaseRecord {
	id: AirtableRecordId;
	name?: string;
	type?: string;
	site?: string;
	primaryProject?: string;
	professions?: string[];
	organizations?: string[];
	nationality?: string[];
	extracts?: AirtableRecordId[];
	extractTitles?: string[];
	spaces?: AirtableRecordId[];
	spaceTopics?: string[];
	connectedCreators?: AirtableRecordId[];
	connectedCreatorNames?: string[];
	numWorks: number;
	numFragments: number;
	numExtracts: number;
	createdTime: string;
	lastUpdated: string;
}

export interface ICreator {
	id: AirtableRecordId;
	name?: string;
	type?: string;
	site?: string;
	primaryProject?: string;
	professions?: string[];
	organizations?: string[];
	nationality?: string[];
	extracts?: ILinkedRecord[];
	spaces?: ILinkedRecord[];
	connectedCreators?: ILinkedRecord[];
	numWorks: number;
	numFragments: number;
	numExtracts: number;
	createdTime: string;
	lastUpdated: string;
	_original: IBaseCreator;
}

export interface IBaseSpace extends IBaseRecord {
	id: AirtableRecordId;
	topic?: string;
	title?: string;
	icon?: string;
	description?: string;
	extracts?: AirtableRecordId[];
	extractTitles?: string[];
	connectedSpaces?: AirtableRecordId[];
	connectedSpaceTopics?: string[];
	lastUpdated: string;
	createdTime: string;
}

export interface ISpace {
	id: string;
	topic?: string;
	title?: string;
	icon?: string;
	description?: string;
	extracts?: ILinkedRecord[];
	connectedSpaces?: ILinkedRecord[];
	lastUpdated: Date;
	createdTime: Date;
	_original: IBaseSpace;
}
