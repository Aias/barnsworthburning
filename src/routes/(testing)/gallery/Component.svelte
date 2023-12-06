<script>
	let { extract } = $props();

	extract;
	// let title = $derived(extract?.title);
	// let title = extract?.title;
	let derived = $derived(extract?.title);
	let direct = extract?.title;
</script>

<div>
	<h2>Direct: {direct}</h2>
	<h2>Derived: {derived}</h2>
</div>
