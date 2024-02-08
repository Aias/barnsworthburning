<script>
	import { page } from '$app/stores';

	let { toExtract, childAnchor, toCreator, toSpace, ref, ...restProps } = $props();

	let href = $state();

	let currentExtract = $derived($page.params?.extract);
	let currentCreator = $derived($page.url.searchParams?.get('creator'));
	let currentSpace = $derived($page.url.searchParams?.get('space'));

	$effect(() => {
		let url = new URL($page.url);

		if (toExtract === null) {
			url.pathname = '/';
		} else {
			let newExtract = toExtract || currentExtract;
			url.pathname = `/${newExtract}`;
		}

		if (childAnchor) {
			url.hash = childAnchor;
		} else {
			url.hash = '';
		}

		if (toCreator === null || toSpace === null) {
			url.searchParams.delete('creator');
			url.searchParams.delete('space');
		} else if (toCreator) {
			let newCreator = toCreator || currentCreator;
			url.searchParams.delete('space');
			url.searchParams.set('creator', newCreator);
		} else if (toSpace) {
			let newSpace = toSpace || currentSpace;
			url.searchParams.delete('creator');
			url.searchParams.set('space', newSpace);
		}

		href = url.pathname + url.search + url.hash;
	});

	let isActive = $derived(
		(currentExtract && currentExtract === toExtract) ||
			(currentCreator && currentCreator === toCreator) ||
			(currentSpace && currentSpace === toSpace)
	);
</script>

<a {href} class:active={isActive} {...restProps} bind:this={ref}><slot /></a>
