<script>
	export let viewBox = '0 0 160 160';
	export let className = null;
</script>

<svg
	class="{className}"
	class:icon="{true}"
	xmlns="http://www.w3.org/2000/svg"
	viewBox="{viewBox}"
>
	<slot></slot>
</svg>

<style>
	svg {
		fill: currentColor;
		height: 1em;
	}
</style>
