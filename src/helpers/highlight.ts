/**
 * Highlight occurrences of a search query using the CSS `::highlight` API.
 * Defaults to elements with the `.extract` class.
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

	elements.forEach((el) => {
		const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
		let node: Node | null;
		while ((node = walker.nextNode())) {
			const text = node.textContent ?? '';
			let match: RegExpExecArray | null;
			const regex = new RegExp(query, 'gi');
			while ((match = regex.exec(text)) !== null) {
				const range = new Range();
				range.setStart(node, match.index);
				range.setEnd(node, match.index + query.length);
				ranges.push(range);
			}
		}
	});

	const searchHighlight = new Highlight(...ranges);
	CSS.highlights.set('search-results', searchHighlight);
}
