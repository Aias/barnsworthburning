<script lang="ts">
	import { page } from '$app/stores';
	import { decodeTrail } from '$helpers/params';
	import Looseleaf from '$components/Looseleaf.svelte';

	let trail = $derived(decodeTrail($page.params.trail));
	let data = $derived($page.data);

	let screens = $derived(trail.map((segment) => data[segment.id]));
</script>

{#each trail as segment, i (segment.id)}
	<section>
		<h2>{segment.id} ({segment.entityType?.title})</h2>
		<Looseleaf extracts={screens[i]} scale={0.64} />
	</section>
{/each}

<style lang="scss">
	section {
		flex: 0 0 540px;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
</style>
