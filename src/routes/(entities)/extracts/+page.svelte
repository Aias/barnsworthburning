<script lang="ts">
	import cache from '$lib/cache.svelte';
	import CreatorList from '$components/CreatorList.svelte';
	import markdown from '$helpers/markdown';

	let { data } = $props();

	$effect(() => {
		cache.addExtracts(data.recentExtracts);
	});

	const cachedExtracts = $derived(cache.allExtracts);
</script>

<ul class="extract-list">
	{#each cachedExtracts as extract (extract.id)}
		<li>
			<article>
				<header>
					{#if extract.michelinStars}
						<span class="stars">
							{#each Array(extract.michelinStars) as _}
								<span>⭐</span>
							{/each}
						</span>
					{/if}
					<strong>{extract.title}</strong>
					<CreatorList creators={extract.creators} class="creators" />
				</header>
				{#if extract.extract}
					<blockquote>
						{@html markdown
							.parse(extract.extract)
							.toString()
							.replaceAll('<br>', '<span class="line-break"></span>')}
					</blockquote>
				{/if}
			</article>
		</li>
	{/each}
</ul>

<style>
	ul {
		border: 1px solid var(--divider);
		display: flex;
		flex-direction: column;
		border-radius: var(--border-radius-medium);
		background-color: var(--paper);
	}
	li {
		padding-inline: 1em;
		padding-block: 0.25em;
		&:not(:last-child) {
			border-bottom: 1px solid var(--divider);
		}
		&:hover {
			background-color: var(--splash);
			cursor: pointer;
		}
	}
	.stars {
		font-size: 0.75em;
		transform: translate(0, -2px);
	}
	header {
		display: flex;
		align-items: baseline;
		gap: 0.75em;
		overflow: hidden;
		white-space: nowrap;

		& > strong {
			flex: 0 1 auto;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		& > :global(.creators) {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	blockquote {
		all: unset;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		color: var(--secondary);
	}
	blockquote :global {
		* {
			display: inline;
			white-space: nowrap;
			margin: 0;
			padding: 0;
			border: none;
		}
		br {
			display: none;
		}
		.line-break::after {
			content: '/';
			margin-inline: 0.5ch;
			color: var(--hint);
		}
	}
</style>
