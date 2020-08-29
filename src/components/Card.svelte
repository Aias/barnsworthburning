<script>
	export let inverted = false;
</script>

<section class:🌒="{inverted}" class:card="{true}" {...$$restProps}>
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
</style>
