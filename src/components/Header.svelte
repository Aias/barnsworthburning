<script>
	import Link from './Link.svelte';

	let pointerRight = '›';
	let pointerLeft = '‹';
	let spaces = [
		'user experience',
		'understanding',
		'architecture',
		'information',
		'constraints',
		'creativity',
		'teaching',
		'thinking',
		'learning',
		'planning',
		'business',
		'geometry',
		'systems',
		'writing',
		'meaning',
		'sadness',
		'beauty',
		'nature',
		'seeing',
		'design',
		'craft',
		'tools',
		'color',
		'words',
		'death',
		'work',
		'code',
		'type',
		'food',
		'time',
		'love',
		'life',
		'zen',
		'art'
	];
</script>

<div class="container text-mono">
	<details>
		<summary>
			<strong>.<abbr title="Nicholas Edward Trombley">NET</abbr></strong
			>
			<span class="pointer">&nbsp;››››››››››››››››&nbsp;</span>
			<span>et al</span>			
		</summary>
	</details>
	<details>
		<summary>
			<span>via</span>
			<span class="pointer">&nbsp;›››››&nbsp;</span>
			<strong>BARNSWORTHBURNING</strong>	
		</summary>
	</details>
	<details open>
		<summary>
			<span>on</span>
			<span class="pointer">&nbsp;›››››››››››››››››&nbsp;</span>
			<Link href="/commonplace/spaces/design"><strong>DESIGN</strong></Link>	
		</summary>
		<ol>
			{#each spaces as space}
			<li>{space}</li>
			{/each}
		</ol>
	</details>
</div>

<style>
	.container {
		padding: 0.25rem 2rem;
		border-right: 0.5rem solid var(--layer-highlight);
		display: flex;
		flex-direction: column;
	}
	details {
		white-space: nowrap;
		padding: 0.25rem 1rem;
		border-radius: 1rem;
		background-color: var(--layer-highlight);
	}
	details summary::-webkit-details-marker {
		display:none;
	}
	details + details {
		margin-top: 0.75rem;
	}

	details :global(a) {
		font-size: 1em;
	}

	ol {
		list-style-type: none;
		margin: 1rem 0;
		padding: 0;
		text-align: right;
	}

	strong {
		text-shadow: 0 0 0.5px currentColor;
		font-weight: normal;
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