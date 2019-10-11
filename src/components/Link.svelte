<script>
	export let title = undefined;
	export let label = undefined;
	export let href = '#';
	export let prefetch = false;
	export let plain = false;
	export let className = undefined;
	export let active = false;
</script>

<a
	class:link="{true}"
	class="{className}"
	class:inherit="{plain}"
	class:active="{active}"
	aria-label="{label}"
	{title}
	{href}
	rel="{prefetch ? 'prefetch' : undefined}"
	><slot></slot
></a>

<style>
	.active {
		text-decoration: none;
	}
</style>
