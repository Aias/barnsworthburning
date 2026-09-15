import { Marked } from 'marked';

const markdown = new Marked({
	breaks: true,
	renderer: {
		link({ href, title, tokens }) {
			return `<a href="${href}" target="_blank"${title ? ` title="${title}"` : ''}>${this.parser.parseInline(tokens)}</a>`;
		}
	}
});

export default {
	parse: (source: string) => markdown.parse(source, { async: false }),
	parseInline: (source: string) => markdown.parseInline(source, { async: false }),
	parsePreview: (source: string) =>
		markdown
			.parse(source, { async: false })
			.toString()
			.replaceAll('<br>', '<span class="line-break"></span>')
			.replaceAll(/<\/?a(?:\s+[^>]*)?>/g, '')
};
