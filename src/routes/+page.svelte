<script lang="ts">
	import { onMount } from 'svelte';
	import trail from '$lib/trail.svelte';

	onMount(() => {
		trail.clearTrail();
	});
</script>
