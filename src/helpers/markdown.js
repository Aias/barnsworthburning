import Remarkable from 'remarkable';
let markdown = new Remarkable({
	breaks: true,
	typographer: true,
	html: true
});

export default markdown;
