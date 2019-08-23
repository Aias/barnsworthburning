<script>
	import Link from './Link.svelte';
	import Pointers from './Pointers.svelte';
	import { slide } from 'svelte/transition';
	import { spaces, selectedSpace } from '../stores';

	$: keys = Object.keys($spaces).sort((a, b) => b.length - a.length); // Should already be sorted, but may as well be sure.
	$: headerWidth = getHeaderWidth(contents);

	let navOpen = false;

	const makeToggleNav = (isOpen) => (e) => {
		e.stopPropagation();
		if(typeof isOpen === "boolean") {
			navOpen = isOpen;
		}
		else {
			navOpen = !navOpen;
		}
		
	}

	const getHeaderWidth = (contents, minWidth = 25) => {
		return minWidth;
	}

	const getTotalChars = summary => {
		return summary.reduce((prev, cur) => prev + cur.text.length, 0);
	}

	const getPointers = (summary) => {
		let summaryWidth = typeof summary === "string" ? summary.length : getTotalChars(summary);

		return headerWidth - summaryWidth;
	}
</script>

<div class="container text-mono" on:click="{makeToggleNav(false)}">
	<section>
		<header>
			<strong><abbr title="Nicholas Edward Trombley">.NET</abbr></strong>
			<Pointers count="{getPointers('.NETet al')}" />
			<span>et al</span>
		</header>
	</section>
	<section>
		<header>
			<span>via</span>
			<Pointers count="{getPointers('viabarnsworthburning')}" />
			<strong>BARNSWORTHBURNING</strong>
		</header>
	</section>
	<section class="themey expandable" class:open="{navOpen}">
		<header on:click="{makeToggleNav()}" on:mouseenter="{makeToggleNav(true)}">
			<span>on</span>
			<Pointers count="{getPointers(`on${$selectedSpace}`)}" />
			<strong>{$selectedSpace}</strong>
		</header>
		{#if navOpen}
		<ol transition:slide>
			{#each keys as space}
			<li>
				{#if $selectedSpace == space}
				<span>
					<Pointers count="{getPointers(space) + 1}" />
					<strong>{space}</strong>
				</span>
				{:else}
				<a href="/commonplace/spaces/{space}">
					<Pointers count="{getPointers(space) + 1}" type="space" />
					<strong>{space}</strong>
				</a>
				{/if}
			</li>
			{/each}
		</ol>
		{/if}
	</section>
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

	.expandable > header {
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

	strong {
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

		:global(.pointer) {
			display: none;
		}
	}
</style>