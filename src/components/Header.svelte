<script>
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import { slide } from 'svelte/transition';
	import { FULL_API } from '../config.js';

	import Link from './Link.svelte';

	export let segment = undefined;
	let spaces = [];

	const { page } = stores();

	$: currentSpace = segment === 'spaces' ? getSpaceFromPath($page.path) : undefined;

	const getSpaceFromPath = (path = '') => {
		return path.split('/').filter(p => p !== '')[1];
	}

	onMount(async () => {
		let options = {
			fields: ['topic', 'field_length', 'num_extracts', 'title', 'description'],
			view: 'released'
		};

		const s = await fetch(`${FULL_API}/airtableGet?base=commonplace&table=spaces&options=${JSON.stringify(options)}`)
			.then(data => data.json())
			.catch(error => {
				console.log(error);
				return [];
			});

		spaces = s;
	})
</script>

<nav class="container text-mono">
	<ul class="waypoint primary">
		<li class:active={!segment}>
			<Link href="/">barnsworthburning</Link>
		</li>
	</ul>
	<ul class="waypoint">
		<li class:active={segment === 'works'}>
			<Link href="/works">referenced works</Link>
		</li>
	</ul>
	{#if spaces.length > 0}
	<ul class="spaces" transition:slide>
		{#each spaces as {topic}}
		<li class:active={currentSpace === topic}>
			<Link href="/spaces/{topic}">{topic}</Link>
		</li>
		{/each}
	</ul>
	{/if}
	<ul class="waypoint">
		<!-- <li class:active={segment === 'about'}><Link href="/about">info</Link></li> -->
		<li>
			<Link href="https://airtable.com/shrImoxRyZoDYdNg2">data</Link>
		</li>
		<li>
			<Link href="https://github.com/Aias/barnsworthburning">code</Link>
		</li>
		<li>
			<Link href="https://barnsworthburning-api.netlify.com/.netlify/functions/feed">feed</Link>
		</li>
	</ul>
</nav>

<style>
	nav {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	nav :global(.link) {
		color: currentColor;
	}

	ul {
		list-style-type: none;
		flex: 0 1 auto;
		margin: 0;
		padding-right: 1rem;
	}

	ul + ul {
		margin-top: 1.5rem;
	}

	ul.spaces {
		flex: 0 1 auto;
		overflow: auto;
	}

	li {
		text-align: right;
		padding: 0 4px;
	}

	.waypoint {
		font-weight: 500;
	}

	.primary {
		color: var(--theme-primary-text);
	}

	.active {
		background-color: currentColor;
		transition: background-color 0.2s;
	}

	.active :global(.link) {
		color: var(--text-inverted);
		font-weight: 500;
	}

	@media(max-width: 750px) {
		li {
			display: inline-block;
			text-align: left;
			padding: 0 0.5rem;
			position: relative;
			left: -0.5rem;
		}

		ul + ul {
			margin-top: 1rem;
		}

		ul.spaces {
			overflow: initial;
		}
	}
</style>