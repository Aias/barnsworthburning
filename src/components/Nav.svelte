<script>
	import Link from './Link.svelte';
	import About from './icons/About.svelte';
	import Book from './icons/Book.svelte';
	import Home from './icons/Home.svelte';
	import Projects from './icons/Projects.svelte';
	import Writing from './icons/Writing.svelte';

	let links = [
		// {
		// 	path: undefined,
		// 	title: 'Home',
		// 	icon: Home
		// },
		{
			path: 'spaces',
			title: 'Spaces',
			icon: Book
		},
		{
			path: 'extracts',
			title: 'Extracts',
			icon: Projects
		},
		{
			path: 'groups',
			title: 'Works',
			icon: Writing
		},
		{
			path: 'creators',
			title: 'Creators',
			icon: About
		}
	];
	export let currentPage = undefined;
</script>

<nav class="themey">
	<ul>
		{#each links as {path, title, icon}}
		<li>
			<Link active="{currentPage === path}" className="nav-link" prefetch href="{path || '/'}" {title}>
				<span class="pointer">‹‹‹</span>
				<span class="space">&nbsp;</span>
				<svelte:component this={icon} />
				<span class="title">{title}</span>
				<span class="space">&nbsp;</span>
				<span class="pointer">›››</span>
			</Link>
		</li>
		{/each}
	</ul>
</nav>

<style>
	nav {
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

	li :global(.icon) {
		height: 1.5rem;
		display: none;
	}

	.title {
		text-transform: uppercase;
	}

	@media(max-width: 1080px) {
		.pointer,
		.space {
			display: none;
		}
	}

	@media(max-width: 600px) {
		.title {
			display: none;
		}
		li :global(.icon) {
			display: inline-block;
		}
	}
</style>