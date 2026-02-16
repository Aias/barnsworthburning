import { Marked, type Tokens } from 'marked';

const linkRenderer = ({ href, title, text }: Tokens.Link) =>
	`<a href="${href}" target="_blank"${title ? ` title="${title}"` : ''}>${text}</a>`;

const markdown = new Marked({
	breaks: true,
	renderer: {
		link: linkRenderer
	}
});

export default markdown;
