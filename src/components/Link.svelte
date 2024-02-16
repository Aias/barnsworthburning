<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';

	interface LinkProps {
		toExtract?: string;
		childAnchor?: string;
		toCreator?: string;
		toSpace?: string;
		children: Snippet;
	}

	let { toExtract, childAnchor, toCreator, toSpace, children, ...restProps } =
		$props<LinkProps>();

	let href = $state<string>();

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
			url.searchParams.delete('space');
			url.searchParams.set('creator', toCreator);
		} else if (toSpace) {
			url.searchParams.delete('creator');
			url.searchParams.set('space', toSpace);
		}

		href = url.pathname + url.search + url.hash;
	});

	let isActive = $derived(
		(currentExtract && currentExtract === toExtract) ||
			(currentCreator && currentCreator === toCreator) ||
			(currentSpace && currentSpace === toSpace)
	);
</script>

<a {href} class:active={isActive} {...restProps}>{@render children()}</a>
