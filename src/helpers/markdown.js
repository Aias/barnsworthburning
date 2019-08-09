import Remarkable from 'remarkable';
let markdown = new Remarkable({
	breaks: true,
	typographer: true,
	html: true
});

markdown.core.ruler.enable(['abbr']);

export default markdown;
