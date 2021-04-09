<script context="module">
	export async function load({ page, fetch }) {
		const { params } = page;
		const { entity, slug } = params;

		console.log("rendering gallery", entity, slug);

		const { creator, space, extracts, error } = await fetch(`/airtable/gallery/${entity}/${slug}.json`).then(res => res.json());


		return {
			props: {
				creator,
				space,
				extracts					
			},
			error
		};
	}
</script>

<script>
	import ExtractGallery from '../../../components/ExtractGallery.svelte';

	export let creator;
	export let space;
	export let extracts;
	export let segment;
</script>

{#if creator || space}
<div class="layout__gallery" class:segment="{segment}">
	<ExtractGallery {creator} {space} {extracts} />
</div>
<div class="layout__panel"><slot /></div>
{/if}