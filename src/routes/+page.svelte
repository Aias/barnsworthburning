<script>
	let { data } = $props();
	import Index from '$components/Index.svelte';
	
	$effect(() => {
		console.log(data)
	})
</script>

<Index creators={data.creators} spaces={data.spaces} />