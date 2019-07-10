<script>
	import { onMount } from 'svelte';

	onMount(() => {
		fetch(`nonlessons/patterns/base.json`)
			.then(data => data.json())
			.then(json => {
				console.log(json);
			});
	});
</script>

<div>
	Stuff
</div>
