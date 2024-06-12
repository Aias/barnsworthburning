import { Marked, type Tokens, parse } from 'marked';

const linkRenderer = ({ href, title, text }: Tokens.Link) => {
	const target = '_blank';
	const titleTag = title ? ` title="${title}"` : '';
	return `<a href="${href}" target="${target}"${titleTag}>${text}</a>`;
};

const inlineParagraphRenderer = (token: Tokens.Paragraph) => token.text;

export const markdown = new Marked({
	breaks: true,
	useNewRenderer: true,
	renderer: {
		link: linkRenderer
	}
});
export const inlineMarkdown = new Marked({
	breaks: false,
	useNewRenderer: true,
	renderer: {
		paragraph: inlineParagraphRenderer
	}
});

export default markdown;
