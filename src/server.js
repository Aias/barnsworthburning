import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
// import proxyMiddleware from 'http-proxy-middleware';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const server = polka();

// Set up API proxy.
// server.use(
// 	proxyMiddleware('/api', {
// 		target: 'https://barnsworthburning-api.netlify.com/.netlify/functions',
// 		pathRewrite: { '^/api': '' },
// 		changeOrigin: true
// 	})
// );

server // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
