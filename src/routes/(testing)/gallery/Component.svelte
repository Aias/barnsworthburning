<script>
	let { extract } = $props();

	extract;

	let title = $derived(extract?.title);
</script>

<div>
	<h2>{title}</h2>
</div>
