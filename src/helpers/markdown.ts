import { Remarkable } from 'remarkable';

const markdown = new Remarkable({
	// typographer: true,
	breaks: true,
	html: true
});

markdown.core.ruler.enable(['abbr']);

export default markdown;
