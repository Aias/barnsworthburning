import { Client } from '@notionhq/client';

// Initializing a client
const notion = new Client({
	auth: import.meta.env.VITE_NOTION_TOKEN
});

const databases = {
	extracts: '92f18cda847942e294abf6acef99f972',
	creators: '8f5d7b329cfe4cb385a20094342e9185',
	weeklyLinks: '1369b2d5a3144aad8e7272d3725434ca',
	writing: 'd3aeff46bba444a0b98c198d4f642ab8'
};

export default notion;
export { databases };
