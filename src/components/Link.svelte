<script>
	export let title = null;
	export let href = '#';
	export let prefetch = false;
	export let plain = false;
	export let className = null;
	export let active = false;
</script>

<a
	class="{className}"
	class:inherit="{plain}"
	class:active="{active}"
	{title}
	{href}
	rel="{prefetch ? 'prefetch' : ''}"
	><slot></slot
></a>

<style>
	.active {
		text-decoration: none;
	}
</style>
