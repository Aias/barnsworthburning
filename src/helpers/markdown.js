import { Remarkable } from 'remarkable';
import meta from 'remarkable-meta';

let markdown = new Remarkable({
	typographer: true,
	breaks: true,
	html: true
}).use(meta);

markdown.core.ruler.enable(['abbr']);

export default markdown;
