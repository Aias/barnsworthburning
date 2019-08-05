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
	a {
		font-family: var(--font-stack-mono);
		color: var(--theme-primary-text);
		text-decoration: underline;
		letter-spacing: 0.25px;
		font-size: 0.875em;
		line-height: inherit;
	}

	a:hover {
		color: var(--theme-accent-text);
	}

	.plain {
		all: inherit;
		cursor: pointer;
	}

	.active {
		text-decoration: none;
	}
</style>
