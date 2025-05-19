<script lang="ts">
	import markdown from '$helpers/markdown';
	import BlockLink from './BlockLink.svelte';
	import Citation from './Citation.svelte';
	import TopicList from './TopicList.svelte';
	import RelationList from './RelationList.svelte';
	import AirtableImage from './AirtableImage.svelte';
	import Link from './Link.svelte';
	import { AirtableBaseId, ExtractView, Table, type IExtract } from '$types/Airtable';
	import { classnames } from '$helpers/classnames';
	import type { HTMLAttributes } from 'svelte/elements';
	import CreatorList from './CreatorList.svelte';
	// import SourceLink from './SourceLink.svelte';

	interface ExtractProps<T extends keyof HTMLElementTagNameMap>
		extends HTMLAttributes<HTMLElementTagNameMap[T]> {
		extract: IExtract;
		element?: T;
		suppressBlockLink?: boolean;
		variant?: 'default' | 'card';
		class?: string;
	}

	let {
		extract,
		element = 'article',
		suppressBlockLink = false,
		class: className,
		variant = 'default'
	}: ExtractProps<keyof HTMLElementTagNameMap> = $props();

	let id = $derived(extract.id);
	let title = $derived(extract.title);
	let extractContent = $derived(extract.extract);
	let notes = $derived(extract.notes);
	let images = $derived(extract.images);
	let imageCaption = $derived(extract.imageCaption);
	let source = $derived(extract.source);
	let parent = $derived(extract.parent);
	let parentCreators = $derived(extract.parentCreators);
	let children = $derived(extract.children);
	let connections = $derived(extract.connections);
	let spaces = $derived(extract.spaces);

	let hasRelations = $derived(children || connections || spaces);

	let airtableUrl = $derived(
		`https://airtable.com/${AirtableBaseId}/${Table.Extracts}/${ExtractView.EntryView}/${extract.id}`
	);
	const openInAirtable = (event: MouseEvent) => {
		event.preventDefault();
		window.open(airtableUrl, '_blank');
	};
</script>

<BlockLink
	{element}
	class={classnames('extract', `extract--${variant}`, 'ssm-container', className)}
	suppress={suppressBlockLink}
>
	{#if parent}
		<section class="extract-parent">
			<strong class="parent-title"><Link toId={parent.id} inherit>{parent.name}</Link></strong>
			{#if parentCreators}
				<CreatorList class="parent-creators" creators={parentCreators} />
			{/if}
		</section>
	{/if}
	<section class="extract-body">
		{#if title}
			<header>
				<h2 class="extract-title">
					<Link toId={id} class="main-link" inherit>
						{title}
					</Link>
				</h2>
				<button
					class="ssm content-opener chromatic"
					onclick={openInAirtable}
					title="Open in Airtable">☁️</button
				>
			</header>
		{/if}
		<figure class="extract-main">
			{#if images}
				{#each images as image (image.id)}
					<AirtableImage {image} />
				{/each}
				{#if imageCaption}
					<div class="extract-image-caption content">
						{@html markdown.parse(imageCaption)}
					</div>
				{/if}
			{/if}
			{#if extractContent}
				<blockquote class="extract-text content" cite={source}>
					{@html markdown.parse(extractContent)}
				</blockquote>
			{/if}
			<Citation {extract} element="figcaption" />
		</figure>
		{#if hasRelations}
			<nav class="relations">
				{#if children}
					<RelationList items={children} symbol="↳" label="Children" />
				{/if}
				{#if connections}
					<RelationList items={connections} symbol="⮂" label="Connections" />
				{/if}
				{#if spaces}
					<TopicList topics={spaces} />
				{/if}
			</nav>
		{/if}
	</section>
	{#if notes}
		<footer class="extract-footer content">
			{@html markdown.parse(notes)}
		</footer>
	{/if}
</BlockLink>
