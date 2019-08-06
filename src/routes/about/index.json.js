import { getFile } from '../../helpers/writing';

export function get(req, res, next) {
	let content = getFile('about');

	if (typeof content === 'object') {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify(content));
	} else {
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});
		res.end(
			JSON.stringify({
				message: `Not found`
			})
		);
	}
}
