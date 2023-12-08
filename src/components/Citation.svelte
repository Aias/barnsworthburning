<script>
	import { article } from '$helpers/grammar';
	import CreatorList from './CreatorList.svelte';
	import Link from './Link.svelte';

	export let extract = undefined;

	$: type = extract?.type || 'Work';
	$: creators = extract?.creators || extract?.parentCreators;
	$: parent = extract?.parent;
	$: source = extract?.source;
</script>

<div class="citation">
	<div class="text-mono">
		<span class="article">{article(type)}</span>
		<strong class="type">{type}</strong>
		{#if parent}
			<span class="parent">from <Link toExtract={parent.id}><cite>{parent.name}</cite></Link></span>
		{/if}
		{#if creators}
			<span class="creators">by <CreatorList {creators} /></span>
		{/if}
		{#if source}
			<div class="source">
				<a href={source} target="_blank" rel="noreferrer">{new URL(source).hostname}</a>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.citation {
		display: contents;
		color: var(--primary);
	}

	.type {
		text-transform: lowercase;
		color: var(--display);
	}

	cite {
		font-style: italic;
	}

	.source {
		display: inline-flex;
		white-space: nowrap;
		padding: 0 0.5em;
		background-color: var(--splash);
		border: 1px solid var(--divider);
		border-radius: 2px;
		font-size: 0.75em;
		line-height: inherit;

		a {
			color: var(--accent);
			text-decoration: none;
		}

		&:hover {
			background-color: var(--flood);
			cursor: pointer;
		}
	}
</style>
