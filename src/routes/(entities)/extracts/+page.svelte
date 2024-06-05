<script lang="ts">
	import cache from '$lib/cache.svelte';
	import CreatorList from '$components/CreatorList.svelte';
	import markdown from '$helpers/markdown';
	import { article } from '$helpers/grammar.js';
	import Link from '$components/Link.svelte';
	import BlockLink from '$components/BlockLink.svelte';

	let { data } = $props();

	$effect(() => {
		cache.addExtracts(data.recentExtracts);
	});

	const cachedExtracts = $derived(cache.allExtracts);
</script>

<ul class="block-list compact">
	{#each cachedExtracts as extract (extract.id)}
		{@const {
			id,
			michelinStars,
			title,
			creators,
			extract: quote,
			format = 'Fragment',
			images,
			imageCaption,
			notes
		} = extract}
		{@const content = quote || notes}
		<BlockLink element="li">
			<article>
				<section>
					<header>
						{#if michelinStars}
							<span class="stars">
								{#each Array(michelinStars) as _}
									<span>⭐</span>
								{/each}
							</span>
						{/if}
						<strong class="title">
							<Link class="main-link inherit" toId={id}>{title}</Link>
						</strong>
						<CreatorList {creators} class="creators" />
					</header>
					{#if content}
						<blockquote class="summary">
							{@html markdown
								.parse(content)
								.toString()
								.replaceAll('<br>', '<span class="line-break"></span>')}
						</blockquote>
					{:else}
						<p class="summary">
							<span>({article(format)} {format.toLowerCase()})</span>
						</p>
					{/if}
				</section>
				{#if images}
					{@const mainImage = images[0]}
					<figure>
						<img
							src={mainImage.url}
							alt={imageCaption ?? mainImage.filename}
							loading="lazy"
						/>
					</figure>
				{/if}
			</article>
		</BlockLink>
	{/each}
</ul>

<style>
	article {
		display: flex;
		gap: 1em;

		& > section {
			flex: 1;
			overflow: hidden;
		}
		& > figure {
			position: relative;
			width: 5em;
			overflow: hidden;
			border: 1px solid var(--divider);
			border-radius: var(--border-radius-medium);
			& > img {
				position: absolute;
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center;
			}
		}
	}
	header {
		display: flex;
		align-items: baseline;
		gap: 0.75em;
		overflow: hidden;
		white-space: nowrap;

		& > .title {
			flex: 0 1 auto;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		& > .stars {
			font-size: 0.75em;
			transform: translate(0, -2px);
		}

		& > :global(.creators) {
			flex: 1;
			min-width: 20%;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.summary {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		color: var(--secondary);
	}
	blockquote {
		all: unset;
		display: block;

		& :global {
			* {
				all: unset;
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
	}
</style>
