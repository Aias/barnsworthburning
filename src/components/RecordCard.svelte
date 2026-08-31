<script lang="ts">
	import { classnames } from '#helpers/classnames.js';
	import markdown from '#helpers/markdown.js';
	import { visualMedia, type RecordCard } from '#lib/records.js';
	import { PUBLIC_RCR_URL } from '$app/env/public';
	import {
		ArrowLeftRightIcon,
		ArrowRightIcon,
		CloudIcon,
		CornerDownRightIcon
	} from '@lucide/svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import BlockLink from './BlockLink.svelte';
	import Citation from './Citation.svelte';
	import Link from './Link.svelte';
	import RecordAttachment from './RecordAttachment.svelte';
	import RecordMedia from './RecordMedia.svelte';
	import RelationList from './RelationList.svelte';
	import TopicList from './TopicList.svelte';

	interface RecordCardProps<T extends keyof HTMLElementTagNameMap> extends HTMLAttributes<
		HTMLElementTagNameMap[T]
	> {
		record: RecordCard;
		element?: T;
		pageRecordId?: number;
		variant?: 'default' | 'card';
		class?: string;
	}

	let {
		record,
		element = 'article',
		pageRecordId,
		class: className,
		variant = 'default'
	}: RecordCardProps<keyof HTMLElementTagNameMap> = $props();

	let quoted = $derived(record.quoted.filter((target) => target.id !== pageRecordId));
	let respondsTo = $derived(record.respondsTo.filter((target) => target.id !== pageRecordId));

	let mediaItems = $derived(visualMedia(record.media));
	// The title carries the link, so titleless children can't render as chips;
	// they still appear as read-only full cards beneath their parent.
	let linkableChildren = $derived(record.children.filter((child) => child.title));

	let hasRelations = $derived(
		linkableChildren.length > 0 ||
			record.connections.length > 0 ||
			record.tags.length > 0 ||
			record.extras.length > 0
	);
	let rcrUrl = $derived(PUBLIC_RCR_URL ? `${PUBLIC_RCR_URL}/records/${record.id}` : undefined);
</script>

<BlockLink
	{element}
	class={classnames('extract', `extract--${variant}`, 'ssm-container', className)}
	suppress={pageRecordId !== undefined}
>
	{#each record.parents as parent (parent.id)}
		<RecordAttachment record={parent} dock="top" relation="container" />
	{/each}
	{#each respondsTo as responded (responded.id)}
		<RecordAttachment
			record={responded}
			dock="top"
			relation="response"
			preview={responded.preview}
		/>
	{/each}
	<section class="extract-body">
		{#if record.title}
			<header>
				<h2 class="extract-title">
					<Link {record} class="main-link" inherit>{record.title}</Link>
				</h2>

				{#if rcrUrl}
					<a
						class="ssm content-opener chromatic"
						href={rcrUrl}
						target="_blank"
						rel="noopener external"
						title="Open in Red Cliff Record"><CloudIcon /></a
					>
				{/if}
			</header>
		{/if}
		<figure class="extract-main">
			{#if mediaItems.length > 0}
				{#each mediaItems as item (item.id)}
					<RecordMedia media={item} />
				{/each}
				{#if record.mediaCaption}
					<div class="extract-image-caption content">
						{@html markdown.parse(record.mediaCaption)}
					</div>
				{/if}
			{/if}
			{#if record.content}
				<blockquote class="extract-text content" cite={record.url ?? undefined}>
					{@html markdown.parse(record.content)}
				</blockquote>
			{:else if record.summary}
				<blockquote class="extract-text content">
					{@html markdown.parse(record.summary)}
				</blockquote>
			{/if}
			<Citation {record} element="figcaption" />
		</figure>
		{#if hasRelations}
			<nav class="relations">
				{#if linkableChildren.length > 0}
					<RelationList items={linkableChildren} symbol={CornerDownRightIcon} label="Children" />
				{/if}
				{#if record.connections.length > 0}
					<RelationList
						items={record.connections}
						symbol={ArrowLeftRightIcon}
						label="Connections"
					/>
				{/if}
				{#each record.extras as group (group.label)}
					<RelationList items={group.records} symbol={ArrowRightIcon} label={group.label} />
				{/each}
				{#if record.tags.length > 0}
					<TopicList topics={record.tags} />
				{/if}
			</nav>
		{/if}
		{#if record.notes}
			<footer class="extract-notes content">
				{@html markdown.parse(record.notes)}
			</footer>
		{/if}
	</section>
	{#each quoted as quote (quote.id)}
		<RecordAttachment record={quote} dock="bottom" relation="quote" preview={quote.preview} />
	{/each}
</BlockLink>
