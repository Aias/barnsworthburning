<script>
	export let toIndex = false;
	export let toType = '';
	export let toEntity = '';
	export let toExtract = '';
	export let toFragment = '';
	export let prefetch = false;

	import { page as appPage } from '$app/stores';
	import { readable } from 'svelte/store';

	let page;
	if(appPage) {
		page = appPage;
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
			let { entity: currentType, slug: currentEntity, extract } = $page.params;
			let currentExtract, currentFragment;
			if(extract) {
				currentExtract = extract[0];
				currentFragment = extract[1];
			}
			
			let destinationArray = [];
			if(toType !== false && toEntity !== false) {
				destinationArray = destinationArray.concat(toType || currentType, toEntity || currentEntity);

				if(toExtract !== false) {
					destinationArray = destinationArray.concat(toExtract || currentExtract);
					if(toFragment) {
						destinationArray = destinationArray.concat(toFragment || currentFragment);
					}
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