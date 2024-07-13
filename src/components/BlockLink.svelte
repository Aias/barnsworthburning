<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface BlockLinkProps<T extends keyof HTMLElementTagNameMap>
		extends HTMLAttributes<HTMLElementTagNameMap[T]> {
		element?: T;
		suppress?: boolean;
		children: Snippet;
	}
	let {
		element = 'div',
		suppress = false,
		children,
		...restProps
	}: BlockLinkProps<any> = $props();

	const handleBlockLinkClick = (event: MouseEvent) => {
		if (suppress) return; // If we're suppressing the block link, no special handling.
		// Adapted from:
		// https://css-tricks.com/block-links-the-search-for-a-perfect-solution/#comment-1769257
		// https://codepen.io/xelium/pen/OJbEVmL
		const blockClass = '.block-link';
		const linkSelector = `a, button, .link, :any-link`;
		const target = event.target as HTMLElement;
		if (!target) return; // If we don't have a click target (somehow), no special handling.

		const container = target.closest(blockClass);
		const nearestLink = target.closest(`${linkSelector}, ${blockClass}`);
		if (!container || !container.isSameNode(nearestLink)) return; // If we clicked within a link that's not the container, no special handling.

		const mainLink = container.querySelector('.main-link') as HTMLAnchorElement;
		const allLinks = container.querySelectorAll(linkSelector);
		if (!mainLink || window.getSelection()?.toString()) return; // If the user has selected text, don't navigate.
		if (allLinks && Array.from(allLinks).some((item) => item === target)) return; // If the click target is a link, no special handling.

		const href = mainLink.getAttribute('href');
		const { url } = $page;
		if (!href || href === url.href) return; // If the main link doesn't have an href, or we're already on the page, no special handling.

		// No other special cases apply, treat the click as a navigation to the main link's href.
		event.preventDefault();
		event.stopPropagation();
		mainLink.click();
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
	this={element}
	class:block-link={!suppress}
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
	}
</style>
