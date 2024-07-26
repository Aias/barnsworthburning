const CONTENT_TYPE_MAP: Record<string, string> = {
	'.md': 'text/markdown',
	'.txt': 'text/plain'
};

export function getContentType(url: URL): string {
	const extension = url.pathname.match(/\.[^.]+$/)?.[0] || '';
	return `${CONTENT_TYPE_MAP[extension] || 'text/html'}; charset=utf-8`;
}
