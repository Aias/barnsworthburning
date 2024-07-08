<script lang="ts">
	import ExtractGallery from '$components/ExtractGallery.svelte';
	import type { IExtract } from '$types/Airtable';

	type SpaceItemProps = {
		title: string;
		extracts: IExtract[];
	};
	let { title, extracts }: SpaceItemProps = $props();
</script>

<h1>
	{title}
</h1>
<ExtractGallery {extracts} />

<style lang="scss">
	h1 {
		margin-block-end: 0.5em;
	}
</style>
