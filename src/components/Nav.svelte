<script>
	import Link from './Link.svelte';
	let links = [
		{
			path: undefined,
			title: 'Home'
		},
		{
			path: 'commonplace',
			title: 'A Commonplace Book'
		},
		{
			path: 'projects',
			title: 'Projects'
		},
		{
			path: 'blog',
			title: 'Blog'
		},
		{
			path: 'about',
			title: 'About'
		}
	];
	export let currentPage = undefined;
</script>

<nav>
	<ul>
		{#each links as {path, title}}
		<li>
			<Link active="{currentPage === path}" className="nav-link text-inverted" prefetch href="{path || '/'}" {title}>
				<span>‹‹‹</span><span class="title">&nbsp;{title}&nbsp;</span><span>›››</span>
			</Link>
		</li>
		{/each}
	</ul>
</nav>

<style>
	nav {
		background-color: var(--theme-primary-bg);
		padding: 0.25rem 1rem;
		border-radius: 4rem;
		box-shadow: 0 -3px 6px rgba(0,0,0,0.25);
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-around;
	}

	li {
		white-space: nowrap;
		margin: 0 1rem;
		display: inline-flex;
	}

	li > :global(.nav-link) {
		display: inline-flex;
	}

	li > :global(.nav-link.active) {
		flex-direction: row-reverse;
	}

	.title {
		text-transform: uppercase;
	}
</style>