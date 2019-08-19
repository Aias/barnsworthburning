<script>
	// Abandon all hope, ye who enter here.

	import Link from './Link.svelte';
	import range from 'lodash/range';
	import { slide } from 'svelte/transition';
	import { spaces, selectedSpace } from '../stores';

	let pointerRight = '›';
	let pointerLeft = '‹';
	let keys = Object.keys($spaces).sort((a, b) => b.length - a.length); // Should already be sorted, but may as well be sure.

	$: contents = [
		{
			summary: [
				{
					text: '.NET',
					emphasized: true,
					abbr: 'Nicholas Edward Trombley'
				},
				{
					text: 'et al',
					emphasized: false
				}
			],
			details: undefined,
			isOpen: false
		},
		{
			summary: [
				{
					text: 'via',
					emphasized: false
				},
				{
					text: 'barnsworthburning',
					emphasized: true
				}
			],
			details: undefined,
			isOpen: false
		},
		{
			summary: [
				{
					text: 'on',
					emphasized: false
				},
				{
					text: $selectedSpace,
					emphasized: true,
					linkTo: '/commonplace/spaces/design'
				}
			],
			details: keys,
			isOpen: false
		}
	];

	$: headerWidth = getHeaderWidth(contents);

	const getHeaderWidth = (contents, minWidth = 25) => {
		return minWidth;
	}

	const getTotalChars = summary => {
		return summary.reduce((prev, cur) => prev + cur.text.length, 0);
	}

	const getPointers = (summary) => {
		let summaryWidth = typeof summary === "string" ? summary.length : getTotalChars(summary);

		return range(headerWidth - summaryWidth);
	}

	const makeToggleOpen = (i, details) => () => {
		if(!details) return;
		toggleOpen(i);
	}

	const toggleOpen = i => {
		let newContents = [...contents];
		newContents[i].isOpen = !newContents[i].isOpen;
		contents = newContents;
	}
</script>

<div class="container text-mono">
	{#each contents as {summary, details, isOpen}, i}
	<section class:open="{isOpen}" on:mouseenter="{makeToggleOpen(i, details)}" on:mouseleave="{makeToggleOpen(i, details)}">
		<header>
			{#each summary as {text, emphasized, linkTo, abbr}, i}
			{#if i > 0}
			<span class="pointer">
				{#each getPointers(summary) as p}
					{pointerRight}
				{/each}
			</span>	
			{/if}
			<span class:emphasized={emphasized}>
				{#if abbr}
					<abbr title={abbr}>{text}</abbr>
				{:else if linkTo}
					<Link href="{linkTo}">{text}</Link>
				{:else}
					{text}
				{/if}
			</span>
			{/each}
		</header>
		{#if details && isOpen}
		<ol transition:slide>
			{#each details as detail}
			<li>
				{#if $selectedSpace == detail}
				<span>
					<span class="pointer">{pointerRight}{#each getPointers(detail) as p}{pointerRight}{/each}</span>
					<span class="emphasized space-link">
						{detail}
					</span>
				</span>
				{:else}
				<a href="/?📖={detail}">
					<span class="pointer">
						{#each getPointers(detail) as p}
							&nbsp;
						{/each}
					</span>
					<span class="emphasized space-link">
						&nbsp;{detail}
					</span>
				</a>
				{/if}
			</li>
			{/each}
		</ol>
		{/if}
	</section>
	{/each}
</div>

<style>
	.container {
		padding: 0.25rem 2rem;
		border-right: 0.5rem solid var(--layer-highlight);
		display: flex;
		flex-direction: column;
		max-height: 100%;
		overflow-y: hidden;
	}

	section {
		white-space: nowrap;
		padding: 0.25rem 1rem;
		border-radius: 1rem;
		background-color: var(--layer-highlight);
		flex: 0 1 auto;
	}

	section.open {
		overflow-y: auto;
	}

	header {
		cursor: pointer;
	}

	section + section {
		margin-top: 0.75rem;
	}

	ol {
		list-style-type: none;
		margin: 1rem 0;
		padding: 0;
		text-align: right;
		line-height: 1.8;
	}

	.space-link {
		text-transform: uppercase;
	}

	.emphasized {
		text-shadow: 0 0 0.5px currentColor;
		font-weight: normal;
		text-transform: uppercase;
	}

	@media(max-width: 950px) {
		.container {
			border-right: none;
			padding: 0;
			align-items: flex-start;
		}

		.pointer {
			display: none;
		}
	}
</style>