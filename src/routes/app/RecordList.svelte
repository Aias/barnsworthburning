<script lang="ts">
	import BlockLink from '$components/BlockLink.svelte';
	import CreatorList from '$components/CreatorList.svelte';
	import Link from '$components/Link.svelte';
	import { getArticle } from '$helpers/grammar';
	import markdown from '$helpers/markdown';
	import { displayTitle, formatLabel, type RecordCard } from '$lib/records';
	import { StarIcon } from '@lucide/svelte';

	interface RecordListProps {
		records: RecordCard[];
	}
	let { records }: RecordListProps = $props();
</script>

<ul class="block-list compact">
	{#each records as record (record.id)}
		{@const snippet = record.content || record.summary || record.mediaCaption || record.notes}
		{@const image = record.media.find((item) => item.type === 'image')}
		{@const format = formatLabel(record.format)}
		<BlockLink element="li">
			<article>
				<section>
					<header>
						{#if record.rating}
							<span class="stars">
								{#each Array(record.rating) as _, index (index)}
									<StarIcon fill="currentColor" />
								{/each}
							</span>
						{/if}
						<strong class="title">
							<Link class="main-link" {record} inherit>{displayTitle(record)}</Link>
						</strong>
						{#if record.creators.length > 0}
							<CreatorList creators={record.creators} class="creators" />
						{/if}
					</header>
					{#if snippet}
						<blockquote class="summary">
							{@html markdown
								.parse(snippet)
								.toString()
								.replaceAll('<br>', '<span class="line-break"></span>')
								.replaceAll(/<a(?:\s+[^>]*)?>([^<]*)<\/a>/g, '$1')}
						</blockquote>
					{:else if format}
						<p class="summary">
							<span>({getArticle(format)} {format.toLowerCase()})</span>
						</p>
					{/if}
				</section>
				{#if image}
					<figure>
						<img src={image.url} alt={image.altText ?? record.mediaCaption ?? ''} loading="lazy" />
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
			color: var(--accent);
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
