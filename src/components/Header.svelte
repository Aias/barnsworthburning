<script>
	import Link from './Link.svelte';
	import Pointers from './Pointers.svelte';
	import { slide } from 'svelte/transition';
	import { spaces, selectedSpace } from '../stores';

	$: keys = Object.keys($spaces).sort((a, b) => b.length - a.length); // Should already be sorted, but may as well be sure.
	$: headerWidth = getHeaderWidth(keys);

	let navOpen = false;
	let switchNode;
	let navNode;

	const makeToggleNav = (isOpen) => (e) => {
		if(typeof isOpen === "boolean") {
			navOpen = isOpen;
		}
		else if(switchNode.contains(e.target)) {
			navOpen = !navOpen;			
		}
		else if(navNode && navNode.contains(e.target)) {
			return;
		}
		else {
			navOpen = false;
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

<svelte:body on:click={makeToggleNav()}/>

<div class="container text-mono">
	<section>
		<header>
			<!-- TODO: Create a more targeted about page -->
			<strong><Link href="https://nicktrombley.design"><abbr title="Nicholas Edward Trombley">.NET</abbr></Link></strong>
			<Pointers count="{getPointers('.NETet al')}" />
			<span>et al</span>
		</header>
	</section>
	<section>
		<header>
			<span>via</span>
			<Pointers count="{getPointers('viabarnsworthburning')}" />
			<strong><Link href="/">BARNSWORTHBURNING</Link></strong>
		</header>
	</section>
	<section class="themey expandable" class:open="{navOpen}">
		<header bind:this={switchNode} on:mouseenter="{makeToggleNav(true)}">
			<span>on</span>
			<Pointers count="{getPointers(`on${$selectedSpace}`)}" />
			<strong>{$selectedSpace}</strong>
		</header>
		{#if navOpen}
		<ol bind:this={navNode} transition:slide>
			{#each keys as space}
			<li>
				{#if $selectedSpace == space}
				<span><Pointers count="{getPointers(space) + 1}" />
					<strong>{space}</strong></span>
				{:else}
				<a href="/spaces/{space}"><Pointers count="{getPointers(space) + 2}" type="space" /><strong>{space}</strong></a>
				{/if}
			</li>
			{/each}
		</ol>
		{/if}
		<!-- Hacky way to get Sapper's export functionality to render these pages even though the above list doesn't get created on the server. -->
		<div hidden>
		{#each keys as space}
			<a href="/spaces/{space}">{space}</a>
		{/each}
		</div>
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
		scrollbar-width: none;
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
		font-weight: 500;
		text-transform: uppercase;
	}

	abbr {
		text-decoration: none;
	}

	@media(max-width: 950px) {
		.container {
			border-right: none;
			padding: 0;
			align-items: flex-start;
		}

		.expandable {
			align-self: stretch;
		}

		ol {
			display: flex;
			flex-wrap: wrap;
		}

		li + li::before {
			content: ' / ';
			white-space: pre;
		}

		:global(.pointer) {
			display: none;
		}
	}
</style>