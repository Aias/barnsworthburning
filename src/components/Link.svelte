<script>
	import { page } from '$app/stores';
	const { toExtract, toCreator, toSpace, children, ...restProps } = $props();

	const currentSearchParamsString = $derived($page.url.searchParams?.toString());
	const currentExtract = $derived($page.params?.extract);
	const currentCreator = $derived($page.url.searchParams?.get('creator'));
	const currentSpace = $derived($page.url.searchParams?.get('space'));

	const isActive = $derived(
		(currentExtract && currentExtract === toExtract) ||
		(currentCreator && currentCreator === toCreator) ||
		(currentSpace && currentSpace === toSpace)
	);
	
	const makeLinkUrl = () => {
		if (toExtract) {
			return `/${toExtract}?${currentSearchParamsString}`;
		} else if (toCreator) {
			return `?creator=${toCreator}`;
		} else if (toSpace) {
			return `?space=${toSpace}`;
		}
		else {
			return '/'
		}
	};

	const href = $derived(makeLinkUrl());
</script>

<a {href} class:active={isActive} {...restProps}>{@render children()}</a>