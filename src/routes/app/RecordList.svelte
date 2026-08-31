<script lang="ts">
	import BlockLink from '#components/BlockLink.svelte';
	import CreatorList from '#components/CreatorList.svelte';
	import Link from '#components/Link.svelte';
	import { getArticle } from '#helpers/grammar.js';
	import markdown from '#helpers/markdown.js';
	import {
		displayTitle,
		formatLabel,
		recordPreview,
		sections,
		visualMedia,
		type RecordCard
	} from '#lib/records.js';

	interface RecordListProps {
		records: RecordCard[];
	}
	let { records }: RecordListProps = $props();
</script>

<ul class="block-list compact">
	{#each records as record (record.id)}
		{@const snippet = recordPreview(record) || record.childPreview}
		{@const media = visualMedia(record.media)[0] ?? record.childMedia}
		{@const descriptor = formatLabel(record.format) ?? sections[record.type].singular}
		<!-- Alias and sense sit beside the title, unless the second line has no prose
		to show, in which case they fill it instead of the bare descriptor. -->
		<BlockLink element="li">
			<article>
				<section>
					<header>
						<strong class="title">
							<Link class="main-link" {record} inherit
								>{displayTitle(record)}{#if snippet && record.abbreviation}<span
										class="abbreviation">({record.abbreviation})</span
									>{/if}</Link
							>
						</strong>
						{#if snippet && record.sense}
							<span class="sense">{record.sense}</span>
						{/if}
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
					{:else if record.abbreviation || record.sense}
						<p class="summary">
							{#if record.abbreviation}<span class="abbreviation">({record.abbreviation})</span>
							{/if}{#if record.sense}<span class="sense">{record.sense}</span>{/if}
						</p>
					{:else}
						<p class="summary descriptor">({getArticle(descriptor)} {descriptor.toLowerCase()})</p>
					{/if}
				</section>
				{#if media}
					<figure>
						{#if media.type === 'video'}
							<video
								src={media.url}
								aria-label={media.altText ?? record.mediaCaption ?? undefined}
								autoplay
								muted
								loop
								playsinline
								preload="none"
							></video>
						{:else}
							<img
								src={media.url}
								alt={media.altText ?? record.mediaCaption ?? ''}
								loading="lazy"
							/>
						{/if}
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
			& > img,
			& > video {
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

		& > .sense {
			flex: 0 1 auto;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		& > :global(.creators) {
			flex: 1;
			min-width: 20%;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.abbreviation {
		font-weight: var(--font-weight-normal);
		color: var(--secondary);
	}
	.title .abbreviation {
		margin-inline-start: 0.5ch;
	}
	.sense {
		font-style: italic;
		color: var(--secondary);
	}
	.summary {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		color: var(--secondary);
	}
	.descriptor {
		color: var(--hint);
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
