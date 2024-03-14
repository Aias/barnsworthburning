import type { Attachment, FieldSet, Record } from 'airtable';

// const AirtableBaseId = 'appHWZbECVKCSjquH' as const;
export const AirtableBaseId = 'appNAUPSEyCYlPtvG' as const;

export enum AirtableTables {
	Extracts = 'tblACVIEZW68A1mMZ',
	Creators = 'tblWPCpPglI6ssVZv',
	Spaces = 'tblDQjXO9oy2TKTqL',
	Assemblages = 'tbl9R62MN7hQ6nOGw'
}

export enum ExtractViews {
	Best = 'viwCvae2rXQscUap6',
	ByEntryDate = 'viwLItZEyHOGtcoHe',
	Gallery = 'viwEHJGOwWKp7Zebc',
	Works = 'viwTkCBV6uRoHplvP'
}
export enum CreatorViews {
	Alphabetical = 'viwGZDVJxyNDDfOjV',
	ByCount = 'viwcIFF6YBJV0SgE1',
	ByStars = 'viwdUV8VFOvylVdtY',
	RecentlyUpdated = 'viw8aHvPsBm7AJfcC'
}
export enum SpaceViews {
	Alphabetical = 'viwXFuJApmneAzKEh',
	ByCount = 'viw6rBrUfPPkrqMVC',
	ByStars = 'viwYHuokhqY6LpWb3',
	RecentlyUpdated = 'viwmSxAVAT3uJc6xk'
}

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
	totalStars: number;
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
	totalStars: number;
	createdTime: Date;
	lastUpdated: Date;
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
	numExtracts: number;
	totalStars: number;
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
	numExtracts: number;
	totalStars: number;
	lastUpdated: Date;
	createdTime: Date;
}
