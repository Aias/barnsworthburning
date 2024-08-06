<script lang="ts">
	import EntityLayout from './EntityLayout.svelte';
	import type { ICreator, IExtract } from '$types/Airtable';

	interface CreatorItemProps {
		creator: ICreator;
		extracts?: IExtract[];
	}
	let { creator, extracts }: CreatorItemProps = $props();

	let creatorName = $derived(creator.name || 'Anonymous');
</script>

<EntityLayout title={creatorName} {extracts} />
