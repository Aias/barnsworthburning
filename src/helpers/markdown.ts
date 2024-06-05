import { Marked } from 'marked';

const linkRenderer = (href: string, title: string | null | undefined, text: string) => {
	const target = '_blank';
	const titleTag = title ? ` title="${title}"` : '';
	return `<a href="${href}" target="${target}"${titleTag}>${text}</a>`;
};

const renderer = {
	link: linkRenderer
};

const markdown = new Marked({
	breaks: true
});

markdown.use({ renderer });

export default markdown;
