<script>
	export let toIndex = false;
	export let toType = '';
	export let toEntity = '';
	export let toExtract = '';
	export let toFragment = '';
	export let prefetch = false;

	import * as stores from '$app/stores';
	import { readable } from 'svelte/store';

	let page;
	if(stores && stores.page) {
		page = stores.page;
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

			destinationUrl = `/${destinationArray.join('/')}`;
		}
	}

	$: isActive = destinationUrl === $page.path;
</script>

<a sveltekit:noscroll href="{destinationUrl}" class:active="{isActive}" sveltekit:prefetch="{prefetch}" {...$$restProps}>
	<slot />
</a>