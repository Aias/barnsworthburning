<script>
	import { page } from '$app/stores';

	export let toExtract = undefined;
	export let childAnchor = undefined;
	export let toCreator = undefined;
	export let toSpace = undefined;
	export let ref = undefined;

	let href;

	$: currentExtract = $page.params?.extract;
	$: currentCreator = $page.url.searchParams?.get('creator');
	$: currentSpace = $page.url.searchParams?.get('space');

	$: {
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
	}

	$: isActive =
		(currentExtract && currentExtract === toExtract) ||
		(currentCreator && currentCreator === toCreator) ||
		(currentSpace && currentSpace === toSpace);
</script>

<a {href} class:active={isActive} {...$$restProps} bind:this={ref}><slot /></a>
