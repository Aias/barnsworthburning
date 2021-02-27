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
