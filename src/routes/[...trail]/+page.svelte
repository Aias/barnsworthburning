<script>
	import { page } from '$app/stores';
	import { decodeSegment } from '$helpers/params';
	import Looseleaf from '$components/Looseleaf.svelte';

	let trail = $derived($page.params.trail.split('/').map(decodeSegment));
	let data = $derived($page.data);

	let screens = $derived(trail.map((segment) => data[segment.id]));
</script>

{#each trail as segment, i (segment)}
	<section>
		<h2>{segment.id} ({segment.entity.title})</h2>
		<Looseleaf extracts={screens[i]} />
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
