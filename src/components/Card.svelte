<script>
	export let className = undefined;
	export let onClick = undefined;
</script>

<section
	class:card="{true}"
	class="{className}"
	class:clickable="{typeof onClick === 'function'}"
	on:click="{onClick}"
>
	<slot></slot>
</section>

<style>
	section {
		background-color: var(--layer-container);
		padding: 1.25rem 1.5rem;
		border: var(--container-border);
		overflow: hidden;
		transition: border-radius 0.5s, box-shadow 0.25s, background-color 0.25s;
	}

	.clickable:hover {
		background-color: var(--layer-container-hover);
		cursor: pointer;
		box-shadow: 0 1px 1rem var(--clr-darker-10);
	}
</style>
