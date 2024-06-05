<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';

	interface BlockLinkProps {
		element?: string;
		id?: string;
		class?: string;
		children: Snippet;
	}
	let { element = 'div', children, ...restProps }: BlockLinkProps = $props();

	const handleBlockLinkClick = (event: MouseEvent) => {
		// Adapted from:
		// https://css-tricks.com/block-links-the-search-for-a-perfect-solution/#comment-1769257
		// https://codepen.io/xelium/pen/OJbEVmL
		const target = event.target as HTMLElement;
		let card: HTMLElement | null = null;
		let mainLink: HTMLElement | null = null;
		let allLinks: NodeListOf<HTMLElement> | null = null;
		if (target) {
			card = target.closest('.block-link');
		}
		if (card) {
			mainLink = card.querySelector('.main-link');
			allLinks = card.querySelectorAll('a, button, .link, :any-link');
		}
		if (!mainLink || window.getSelection()?.toString()) return;
		if (allLinks && Array.from(allLinks).some((item) => item === target)) return;
		const href = mainLink.getAttribute('href') ?? '/';
		event.preventDefault();
		event.stopPropagation();
		goto(href);
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
	this={element}
	class:block-link={true}
	onclick={handleBlockLinkClick}
	{...restProps}
>
	{@render children()}
</svelte:element>

<style>
	.block-link :global {
		&:has(.main-link:focus-visible) {
			outline: 1px solid var(--main);
		}
		.main-link:focus-visible,
		&:hover .main-link {
			text-decoration: underline;
		}
	}
</style>
