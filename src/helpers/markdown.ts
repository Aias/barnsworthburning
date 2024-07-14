import { Marked, type Tokens, parse } from 'marked';

const linkRenderer = ({ href, title, text }: Tokens.Link) => {
	const target = '_blank';
	const titleTag = title ? ` title="${title}"` : '';
	return `<a href="${href}" target="${target}"${titleTag}>${text}</a>`;
};

const markdown = new Marked({
	breaks: true,
	useNewRenderer: true,
	renderer: {
		link: linkRenderer
	}
});

export default markdown;
