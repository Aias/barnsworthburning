import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import proxyMiddleware from 'http-proxy-middleware';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const server = polka();

// From https://github.com/mrispoli24/sapper-netlify-jamstack-starter
const devProxy = {
	'/.netlify': {
		target: 'http://localhost:9000',
		pathRewrite: { '^/.netlify/functions': '' }
	}
};

// Set up the proxy.
if (dev && devProxy) {
	Object.keys(devProxy).forEach(function(context) {
		server.use(proxyMiddleware(context, devProxy[context]));
	});
}

server // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
