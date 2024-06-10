<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface SourceLinkProps extends HTMLAnchorAttributes {
		href: string;
	}

	let { href, children, ...restProps }: SourceLinkProps = $props();
</script>

<a class="source" {href} target="_blank" rel="noreferrer" title="View source" {...restProps}>
	{new URL(href).hostname}
</a>

<style>
	.source {
		display: inline-flex;
		white-space: nowrap;
		padding-block: 0;
		padding-inline: 0.5em;
		background-color: var(--splash);
		border: 1px solid var(--divider);
		border-radius: var(--border-radius-small);
		font-size: 0.75em;
		line-height: inherit;
		transform: translateY(-0.1em);
		break-before: avoid;
		color: var(--accent);
		text-decoration: none;

		&:hover {
			background-color: var(--flood);
			border-color: var(--boundary);
			cursor: pointer;
		}

		&::after {
			content: '⤤';
			margin-inline-start: 1ch;
		}
	}
</style>
