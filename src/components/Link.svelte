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
	class:plain="{plain}"
	class:active="{active}"
	{title}
	{href}
	rel="{prefetch ? 'prefetch' : ''}"
>
	<slot></slot>
</a>

<style>
	.plain {
		all: inherit;
		cursor: pointer;
	}

	.active {
		text-decoration: none;
	}
</style>
