import type { Attachment, FieldSet, Record as AirtableRecord } from 'airtable';

// const AirtableBaseId = 'appHWZbECVKCSjquH' as const;
export const AirtableBaseId = 'appNAUPSEyCYlPtvG' as const;

export enum Table {
	Extracts = 'tblACVIEZW68A1mMZ',
	Creators = 'tblWPCpPglI6ssVZv',
	Spaces = 'tblDQjXO9oy2TKTqL',
	Assemblages = 'tbl9R62MN7hQ6nOGw'
}

export enum ExtractView {
	Best = 'viwCvae2rXQscUap6',
	ByEntryDate = 'viwLItZEyHOGtcoHe',
	Gallery = 'viwEHJGOwWKp7Zebc',
	Works = 'viwTkCBV6uRoHplvP',
	EntryView = 'viw4zAxRJhQbhTddm',
	Feed = 'viwAdvAy1vJlbCVas'
}
export enum CreatorView {
	Alphabetical = 'viwGZDVJxyNDDfOjV',
	Best = 'viwxE8m6ZZM5CfhB7',
	ByCount = 'viwcIFF6YBJV0SgE1',
	ByStars = 'viwdUV8VFOvylVdtY',
	RecentlyUpdated = 'viw8aHvPsBm7AJfcC'
}
export enum SpaceView {
	Alphabetical = 'viwXFuJApmneAzKEh',
	Best = 'viwdhSigvrkEJBvOH',
	ByCount = 'viw6rBrUfPPkrqMVC',
	ByStars = 'viwYHuokhqY6LpWb3',
	RecentlyUpdated = 'viwmSxAVAT3uJc6xk'
}

type AirtableRecordId = AirtableRecord<FieldSet>['id'];

export interface IBaseRecord {
	id: AirtableRecordId;
	[key: string]: FieldSet[keyof FieldSet] | ILinkedRecord[];
}

export interface ILinkedRecord {
	id: AirtableRecordId;
	name: string;
}

// =============================================================================
// EXTRACT SCHEMA
// =============================================================================

// Schema: defines all extract fields and their types in one place
type BaseExtractFieldTypes = {
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
	publishedOn: string;
	source?: string;
	spaceTopics?: string[];
	spaces?: AirtableRecordId[];
	title?: string;
};

// Interface derived from schema
export interface IBaseExtract extends IBaseRecord, BaseExtractFieldTypes {
	id: AirtableRecordId;
}

// Type alias for field keys
export type ExtractFields = keyof BaseExtractFieldTypes;

// Fields array with compile-time completeness check via Record type
const extractFieldsConfig: Record<ExtractFields, true> = {
	childTitles: true,
	children: true,
	connectionTitles: true,
	connections: true,
	creatorNames: true,
	creators: true,
	extract: true,
	extractedOn: true,
	format: true,
	imageCaption: true,
	images: true,
	lastUpdated: true,
	michelinStars: true,
	notes: true,
	parent: true,
	parentCreatorIds: true,
	parentCreatorNames: true,
	parentTitle: true,
	publishedOn: true,
	source: true,
	spaceTopics: true,
	spaces: true,
	title: true
};

export const extractFields = Object.keys(extractFieldsConfig) as ExtractFields[];

// Mapped/transformed extract type for client use
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
	extractedOn: string;
	lastUpdated: string;
	publishedOn: string;
}

// =============================================================================
// CREATOR SCHEMA
// =============================================================================

// Schema: defines all creator fields and their types in one place
type BaseCreatorFieldTypes = {
	name?: string;
	type?: string;
	site?: string;
	primaryProject?: string;
	professions?: string[];
	organizations?: string[];
	nationality?: string[];
	extracts?: AirtableRecordId[];
	extractTitles?: string[];
	numWorks: number;
	numFragments: number;
	numExtracts: number;
	totalStars: number;
	createdTime: string;
	lastUpdated: string;
};

// Interface derived from schema
export interface IBaseCreator extends IBaseRecord, BaseCreatorFieldTypes {
	id: AirtableRecordId;
}

// Type alias for field keys
export type CreatorFields = keyof BaseCreatorFieldTypes;

// Fields array with compile-time completeness check via Record type
const creatorFieldsConfig: Record<CreatorFields, true> = {
	name: true,
	type: true,
	site: true,
	primaryProject: true,
	professions: true,
	organizations: true,
	nationality: true,
	extracts: true,
	extractTitles: true,
	numWorks: true,
	numFragments: true,
	numExtracts: true,
	totalStars: true,
	createdTime: true,
	lastUpdated: true
};

export const creatorFields = Object.keys(creatorFieldsConfig) as CreatorFields[];

// Mapped/transformed creator type for client use
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
	numWorks: number;
	numFragments: number;
	numExtracts: number;
	totalStars: number;
	createdTime: string;
	lastUpdated: string;
}

// =============================================================================
// SPACE SCHEMA
// =============================================================================

// Schema: defines all space fields and their types in one place
type BaseSpaceFieldTypes = {
	topic?: string;
	title?: string;
	icon?: string;
	description?: string;
	extracts?: AirtableRecordId[];
	extractTitles?: string[];
	numExtracts: number;
	totalStars: number;
	lastUpdated: string;
	createdTime: string;
};

// Interface derived from schema
export interface IBaseSpace extends IBaseRecord, BaseSpaceFieldTypes {
	id: AirtableRecordId;
}

// Type alias for field keys
export type SpaceFields = keyof BaseSpaceFieldTypes;

// Fields array with compile-time completeness check via Record type
const spaceFieldsConfig: Record<SpaceFields, true> = {
	topic: true,
	title: true,
	icon: true,
	description: true,
	extracts: true,
	extractTitles: true,
	numExtracts: true,
	totalStars: true,
	lastUpdated: true,
	createdTime: true
};

export const spaceFields = Object.keys(spaceFieldsConfig) as SpaceFields[];

// Mapped/transformed space type for client use
export interface ISpace {
	id: string;
	topic?: string;
	title?: string;
	icon?: string;
	description?: string;
	extracts?: ILinkedRecord[];
	numExtracts: number;
	totalStars: number;
	lastUpdated: string;
	createdTime: string;
}
