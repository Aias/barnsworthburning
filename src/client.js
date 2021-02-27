import * as sapper from '@sapper/app';

sapper
	.start({
		target: document.querySelector('#sapper')
	})
	.then(() => {
		console.log('app has started');
		console.log(window.location);
		sapper.goto(window.location.pathname);
	});

// https://github.com/sveltejs/sapper/issues/383#issuecomment-593596735
__SAPPER__.preloaded = [];
