<script lang="ts">
	import markdown from '$helpers/markdown';
	import BlockLink from './BlockLink.svelte';
	import Citation from './Citation.svelte';
	import TopicList from './TopicList.svelte';
	import RelationList from './RelationList.svelte';
	import RecordImage from './RecordImage.svelte';
	import Link from './Link.svelte';
	import CreatorList from './CreatorList.svelte';
	import { classnames } from '$helpers/classnames';
	import { displayTitle, type RecordCard } from '$lib/records';
	import { env } from '$env/dynamic/public';
	import type { HTMLAttributes } from 'svelte/elements';

	interface RecordCardProps<T extends keyof HTMLElementTagNameMap> extends HTMLAttributes<
		HTMLElementTagNameMap[T]
	> {
		record: RecordCard;
		element?: T;
		suppressBlockLink?: boolean;
		variant?: 'default' | 'card';
		class?: string;
	}

	let {
		record,
		element = 'article',
		suppressBlockLink = false,
		class: className,
		variant = 'default'
	}: RecordCardProps<keyof HTMLElementTagNameMap> = $props();

	let images = $derived(record.media.filter((item) => item.type === 'image'));
	let hasRelations = $derived(
		record.children.length > 0 ||
			record.connections.length > 0 ||
			record.tags.length > 0 ||
			record.extras.length > 0
	);
	let rcrUrl = $derived(
		env.PUBLIC_RCR_URL ? `${env.PUBLIC_RCR_URL}/records/${record.id}` : undefined
	);
</script>

<BlockLink
	{element}
	class={classnames('extract', `extract--${variant}`, 'ssm-container', className)}
	suppress={suppressBlockLink}
>
	{#if record.parent}
		<section class="extract-parent">
			<strong class="parent-title"
				><Link record={record.parent} inherit>{displayTitle(record.parent)}</Link></strong
			>
			{#if record.parent.creators.length > 0}
				<CreatorList class="parent-creators" creators={record.parent.creators} />
			{/if}
		</section>
	{/if}
	<section class="extract-body">
		{#if record.title}
			<header>
				<h2 class="extract-title">
					<Link {record} class="main-link" inherit>
						{record.title}
					</Link>
				</h2>
				{#if rcrUrl}
					<a
						class="ssm content-opener chromatic"
						href={rcrUrl}
						target="_blank"
						rel="noopener external"
						title="Open in Red Cliff Record">☁️</a
					>
				{/if}
			</header>
		{/if}
		<figure class="extract-main">
			{#if images.length > 0}
				{#each images as image (image.id)}
					<RecordImage media={image} />
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
				{#if record.children.length > 0}
					<RelationList items={record.children} symbol="↳" label="Children" />
				{/if}
				{#if record.connections.length > 0}
					<RelationList items={record.connections} symbol="⮂" label="Connections" />
				{/if}
				{#each record.extras as group (group.predicate)}
					<RelationList items={group.records} symbol="→" label={group.label} />
				{/each}
				{#if record.tags.length > 0}
					<TopicList topics={record.tags} />
				{/if}
			</nav>
		{/if}
	</section>
	{#if record.notes}
		<footer class="extract-footer content">
			{@html markdown.parse(record.notes)}
		</footer>
	{/if}
</BlockLink>
