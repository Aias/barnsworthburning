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

<div class="text-mono">
	<section>
		<strong>.<abbr title="Nicholas Edward Trombley">NET</abbr></strong
		>
		<span class="pointer">&nbsp;››››››››››››››››&nbsp;</span>
		<span>et al</span>
	</section>
	<section>
		<span>via</span>
		<span class="pointer">&nbsp;›››››&nbsp;</span>
		<strong>BARNSWORTHBURNING</strong>
	</section>
	<section>
		<span>on</span>
		<span class="pointer">&nbsp;›››››››››››››››››&nbsp;</span>
		<Link href="/commonplace/spaces/design"><strong>DESIGN</strong></Link>
	</section>
</div>

<style>
	div {
		padding: 0.25rem 2rem;
		border-right: 0.5rem solid var(--layer-highlight);
		display: flex;
		flex-direction: column;
	}
	section {
		white-space: nowrap;
		padding: 0.25rem 1rem;
		border-radius: 1rem;
		background-color: var(--layer-highlight);
	}
	section + section {
		margin-top: 0.75rem;
	}

	section :global(a) {
		font-size: 1em;
	}

	strong {
		text-shadow: 0 0 0.5px currentColor;
		font-weight: normal;
	}

	@media(max-width: 950px) {
		div {
			border-right: none;
			flex-direction: row;
			padding: 0;
		}

		section + section {
			margin-top: 0;
			margin-left: 0.5rem;
		}

		.pointer {
			display: none;
		}
	}
</style>