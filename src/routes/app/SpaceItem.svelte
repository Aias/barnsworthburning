<script lang="ts">
	import EntityLayout from './EntityLayout.svelte';
	import { capitalize } from '$helpers/grammar';
	import type { ISpace, IExtract } from '$types/Airtable';

	interface SpaceItemProps {
		space: ISpace;
		extracts?: IExtract[];
	}
	let { space, extracts }: SpaceItemProps = $props();

	let title = $derived(capitalize(space.title || space.topic || 'Untagged'));
</script>

<EntityLayout {title} {extracts} />
