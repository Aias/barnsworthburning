<script>
	export let viewBox = '0 0 160 160';
	export let className = null;
	export let title = null;
</script>

<svg class="{className}" class:icon="{true}" xmlns="http://www.w3.org/2000/svg" viewBox="{viewBox}" {...$$restProps}>
	{#if title}
	<title>{title}</title>
	{/if}
	<slot />
</svg>

<style>
	svg {
		fill: currentColor;
		height: 1em;
		display: inline-block;
		vertical-align: text-top;
	}
</style>
