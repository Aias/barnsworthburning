import { Marked } from 'marked';

const linkRenderer = (href: string, title: string | null | undefined, text: string) => {
	const target = '_blank';
	const titleTag = title ? ` title="${title}"` : '';
	return `<a href="${href}" target="${target}"${titleTag}>${text}</a>`;
};

const inlineRenderer = (text: string) => text;

export const markdown = new Marked({
	breaks: true,
	renderer: {
		link: linkRenderer
	}
});
export const inlineMarkdown = new Marked({
	breaks: false,
	renderer: {
		paragraph: inlineRenderer,
		text: inlineRenderer
	}
});

export default markdown;
