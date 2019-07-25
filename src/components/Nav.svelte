<style>
	nav {
		margin: var(--body-padding) var(--body-padding) 0 var(--body-padding);
		padding-bottom: var(--body-padding);
		border-bottom: 1px solid rgba(0, 0, 0, 0.25);
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: flex;
	}

	li + li {
		margin-left: 1em;
	}
</style>

<script>
	let links = [
		{
			path: '/',
			title: 'Home'
		},
		{
			path: 'projects',
			title: 'Projects'
		},
		{
			path: 'blog',
			title: 'Blog'
		}
	];
</script>

<nav>
	<ul>
		{#each links as {path, title}}
		<li>
			<a rel="prefetch" href="{path}" {title}>{title}</a>
		</li>
		{/each}
	</ul>
</nav>
