<script>
	import { page } from '$app/stores';
	import { decodeId } from '$helpers/params';
	import Looseleaf from '$components/Looseleaf.svelte';

	let trail = $derived($page.params.trail.split('/').map(decodeId));
	let data = $derived($page.data);

	let screens = $derived(trail.map((step) => data[step.id]));
</script>

{#each trail as step, i (step)}
	<section>
		<h2>{step.id} ({step.type})</h2>
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
