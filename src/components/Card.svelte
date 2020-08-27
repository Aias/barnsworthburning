<script>
	export let className = undefined;
	export let onClick = undefined;
	export let inverted = false;
</script>

<section class:🌒="{inverted}" class:card="{true}" class="{className}" class:clickable="{typeof onClick === 'function'}" on:click="{onClick}">
	<slot />
</section>

<style>
	section {
		--container-padding-side: 1.5rem;
		--container-padding-top: 1.25rem;
		background-color: var(--layer-container);
		padding: var(--container-padding-top) var(--container-padding-side);
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
