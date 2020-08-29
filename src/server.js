import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const server = polka();

server // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware({
			session: (req, res) => ({
				activeWindow: 'index', // index, gallery, panel
				activeParams: {}
			})
		})
	)
	.listen(PORT, (err) => {
		if (err) console.log('error', err);
	});
