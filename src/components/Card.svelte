<script>
	export let className = null;
</script>

<section class:card="{true}" class="{className}">
	<slot></slot>
</section>

<style>
	section {
		background-color: var(--layer-container);
		padding: 1rem 2rem;
		box-shadow: 0 1px 1rem var(--clr-darker-20);
		border: var(--container-border);
		border-radius: var(--container-border-radius);
	}
</style>
