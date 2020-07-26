<script>
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import { slide } from 'svelte/transition';
	import { FULL_API } from '../config.js';
	import { spaces } from '../stores';

	import Link from './Link.svelte';
	import Spinner from './Spinner.svelte';

	export let segment = undefined;

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

		const fetchedSpaces = await fetch(`${FULL_API}/airtableGet?base=commonplace&table=spaces&options=${JSON.stringify(options)}`)
			.then(data => data.json())
			.catch(error => {
				console.log(error);
				return [];
			});

		$spaces = fetchedSpaces;
	})
</script>

<nav class="container text-mono">
	<ul class="waypoint primary">
		<li class:active={!segment}>
			<Link prefetch href="/">barnsworthburning</Link>
		</li>
	</ul>
	<ul class="waypoint">
		<li class:active={segment === 'works'}>
			<Link prefetch href="/works">referenced works</Link>
		</li>
	</ul>
	<ul class="spaces" transition:slide>
		{#each $spaces as {topic}}
		<li class:active={currentSpace === topic}>
			<Link href="/spaces/{topic}"><label>Subspace: </label>{topic}</Link>
		</li>
		{/each}
	</ul>
	<ul class="waypoint">
		<!-- <li class:active={segment === 'about'}><Link href="/about">info</Link></li> -->
		<li>
			<Link href="https://airtable.com/shrImoxRyZoDYdNg2">data</Link>
		</li>
		<li>
			<Link href="https://github.com/Aias/barnsworthburning">code</Link>
		</li>
		<li>
			<Link href="/feed.xml">feed</Link>
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

	ul.spaces {
		flex: 0 1 auto;
		overflow: auto;
	}

	.spaces label {
		display: inline-block;
		width: 0;
		opacity: 0;
		position: absolute;
		left: 0;
	}

	nav > * + * {
		margin-top: 1.5rem;
	}

	li {
		text-align: right;
		padding: 0 4px;
		position: relative;
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

		nav > * + * {
			margin-top: 1rem;
		}

		ul.spaces {
			overflow: initial;
		}
	}
</style>