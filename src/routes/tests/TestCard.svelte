<script lang="ts">
	import { classnames } from '$helpers/classnames';
	interface TestCardProps {
		mode?: string;
		palette?: string;
		chroma?: string;
	}
	let { mode, palette, chroma }: TestCardProps = $props();
</script>

<article class={classnames(mode, palette, chroma)}>
	<h3>Attention to Detail</h3>
	<p>Truly functional design only comes from the most careful and intense attention to detail.</p>
	<a href="./">Christopher Alexander</a>
	<ul>
		{#if mode}<li>#{mode}</li>{/if}
		{#if palette}<li>#{palette}</li>{/if}
		{#if chroma}<li>#{chroma}</li>{/if}
	</ul>
</article>

<style>
	article {
		padding: 1em;
		border: 1px solid var(--divider);
		border-radius: 4px;
		background-color: var(--paper);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		&:hover {
			border-color: var(--border);
			background-color: var(--container);
			transition: all var(--transition-default);
		}
	}

	h3 {
		text-transform: capitalize;
	}
	p {
		color: var(--display);
	}
	ul {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
		color: var(--hint);
		font-size: 0.75rem;
	}
</style>
