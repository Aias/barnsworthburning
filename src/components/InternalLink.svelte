<script>
	export let toIndex = false;
	export let toType = '';
	export let toEntity = '';
	export let toExtract = '';
	export let toFragment = '';
	export let prefetch = false;

	import { getContext } from 'svelte';
	import { page as pageStore } from '$app/stores';
	import { readable } from 'svelte/store';

	const fromRssFeed = getContext('fromRssFeed');

	let page;
	if(!fromRssFeed) {
		page = pageStore;
	}
	else {
		page = readable({
			params: {
				entity: 'spaces',
				slug: 'design'
			}
		})
	}

	let destinationUrl = '';

	$: {
		if(toIndex) {
			destinationUrl = '/';
		}
		else {
			let { entity: currentType, slug: currentEntity, extract: currentExtract } = $page.params;
			
			let destinationArray = [];
			if(toType !== false && toEntity !== false) {
				destinationArray = destinationArray.concat(toType || currentType, toEntity || currentEntity);

				if(toExtract !== false) {
					destinationArray = destinationArray.concat(toExtract || currentExtract);
				}
			}

			destinationArray = destinationArray.filter(Boolean); // Return only truthy segments.

			destinationUrl = `/${destinationArray.join('/')}${toFragment ? '#' + toFragment : ''}`;
		}
	}

	$: isActive = destinationUrl === $page?.url?.pathname;
</script>

<a sveltekit:noscroll="{fromRssFeed ? null : true}" href="{destinationUrl}" class:active="{isActive}" sveltekit:prefetch="{fromRssFeed ? null : prefetch}" {...$$restProps}>
	<slot />
</a>