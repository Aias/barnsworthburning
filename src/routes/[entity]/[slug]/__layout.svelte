<script context="module">
	export async function load({ params, fetch }) {
		const { entity, slug } = params;

		const { creator, space, extracts, error } = await fetch(`/${entity}/${slug}.json`).then(res => res.json()).catch(e => {
			return {
				error: e
			}
		});

		if(error) {
			console.error(error);
		}

		return {
			props: {
				creator,
				space,
				extracts
			}
		}
	};
</script>

<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ExtractGallery from '../../../components/ExtractGallery.svelte';

	export let creator;
	export let space;
	export let extracts;

	onMount(() => {
		if((!creator || !space) && !extracts) {
			goto('/');
		}
	})
</script>

{#if creator || space}
<div class="layout__gallery">
	<ExtractGallery {creator} {space} {extracts} />
</div>
<div class="layout__panel"><slot></slot></div>
{/if}