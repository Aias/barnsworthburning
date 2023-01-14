<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ExtractGallery from '$components/ExtractGallery.svelte';

	export let data;

	$: creator = data.creator;
	$: space = data.space;
	$: extracts = data.extracts;

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