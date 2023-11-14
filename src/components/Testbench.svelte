<svelte:options runes={true} />

<script>
	let { title = 'Section Title' } = $props();
</script>

<section>
	<h1>{title}</h1>
	<p>
		Here's some text I want you to read. <button>Do Something</button>
	</p>
	<p>
		<slot />
	</p>
</section>


<style>
	h1 {
		color: var(--primary);
	}
	p {
		color: var(--display);
	}
	a {
		color: var(--link);
	}
	a:hover {
		color: var(--link-active);
	}
	section {
		background-color: var(--container);
		padding: 1rem;
		border-radius: 2px;
		border: 1px solid var(--divider);
	}
	h1, p {
		margin: 0;
	}
</style>