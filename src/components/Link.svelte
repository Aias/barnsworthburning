<script>
	import { page } from '$app/stores';

	export let toExtract = undefined;
	export let toCreator = undefined;
	export let toSpace = undefined;
	export let ref = undefined;

	$: currentSearchParamsString = $page.url.searchParams?.toString();
	$: currentExtract = $page.params?.extractId;
	$: currentCreator = $page.url.searchParams?.get('creator');
	$: currentSpace = $page.url.searchParams?.get('space');

	$: isActive =
		(currentExtract && currentExtract === toExtract) ||
		(currentCreator && currentCreator === toCreator) ||
		(currentSpace && currentSpace === toSpace);

	let href;

	$: {
		if (toExtract) {
			href = `/${toExtract}?${currentSearchParamsString}`;
		} else if (toCreator) {
			href = `?creator=${toCreator}`;
		} else if (toSpace) {
			href = `?space=${toSpace}`;
		} else {
			href = '/';
		}
	}
</script>

<a {href} class:active={isActive} {...$$restProps} bind:this={ref}><slot /></a>
