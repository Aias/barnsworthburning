<script>
	import { goto } from '@sapper/app';
	import { onMount } from 'svelte';

	onMount(() => {
		goto(window.location.pathname);
	});
</script>
