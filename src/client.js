import * as sapper from '@sapper/app';

// https://github.com/sveltejs/sapper/issues/383#issuecomment-593596735
// https://github.com/timhall/sapper-spa
// Remove initial empty preload to force load
if (typeof window !== 'undefined' && window.__SAPPER__) {
	window.__SAPPER__.preloaded = [];
}

sapper
	.start({
		target: document.querySelector('#sapper')
	})
	.then(() => {
		console.log('app has started');
		console.log(window.location);
		sapper.goto(window.location.pathname);
	});
