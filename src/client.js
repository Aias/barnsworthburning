import * as sapper from '@sapper/app';

sapper
	.start({
		target: document.querySelector('#🕹️')
	})
	.then(() => {
		sapper.prefetch('/works');
	});
