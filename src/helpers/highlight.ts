/**
 * Highlight occurrences of a search query within the page using the CSS
 * `::highlight` API.
 *
 * @param query - Search term to highlight.
 * @param target - Optional CSS selector, element or NodeList to search.
 *                 Defaults to elements with the `.extract` class.
 */
export function highlightSearchResults(
	query: string,
	target: string | HTMLElement | NodeListOf<HTMLElement> = '.extract'
) {
	if (typeof document === 'undefined' || !CSS.highlights) return;

	CSS.highlights.clear();

	if (!query.trim()) return;

	let elements: NodeListOf<HTMLElement> | HTMLElement[];
	if (typeof target === 'string') {
		elements = document.querySelectorAll<HTMLElement>(target);
	} else if (target instanceof HTMLElement) {
		elements = [target];
	} else {
		elements = Array.from(target);
	}

	const ranges: Range[] = [];
	const lowerQuery = query.toLowerCase();

	elements.forEach((el) => {
		const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
		let node: Text | null;
		while ((node = walker.nextNode() as Text | null)) {
			const text = node.textContent?.toLowerCase() ?? '';
			let match: RegExpExecArray | null;
			const regex = new RegExp(lowerQuery, 'gi');
			while ((match = regex.exec(text)) !== null) {
				const range = new Range();
				range.setStart(node, match.index);
				range.setEnd(node, match.index + lowerQuery.length);
				ranges.push(range);
			}
		}
	});

	const searchHighlight = new Highlight(...ranges);
	CSS.highlights.set('search-results', searchHighlight);
}
