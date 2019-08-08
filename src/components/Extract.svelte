<script>
	import markdown from '../helpers/markdown';
	import get from 'lodash/get';
	import Link from './Link.svelte';
	import Book from './Icons/Book.svelte';

	export let extract = {};

	$: title = get(extract, 'title', 'Untitled');
	$: text = get(extract, 'extract_text', '');
	$: notes = get(extract, 'notes');
	$: extractedOn = new Date(get(extract, 'extracted_on'));

	$: creatorIds = get(extract, 'creator', []);
	$: creatorNames = get(extract, 'creator_name', []);
	$: creators = creatorIds.map((id, i) => ({
		id,
		name: creatorNames[i]
	}));

	$: groupId = get(extract, 'group[0]');
	$: groupName = get(extract, 'group_name[0]');
</script>
{#if extract}
<article>
	<header>
		<slot name="header">
			<h1>
				<Link href="/commonplace"><Book /></Link>
				{title}
			</h1>
		</slot>
	</header>
	<section>
		<slot>
			<blockquote>
				{@html markdown.render(text)}
				<cite class="text-mono">
					{#each creators as {id, name}}
					<Link href="{`/commonplace/creators/${id}`}">{name}</Link>{/each},
					<Link href="{`/commonplace/groups/${groupId}`}">{groupName}</Link>
				</cite>
			</blockquote>
		</slot>
		<aside>
			<slot name="aside">
				{#if notes} {@html markdown.render(notes)} {/if}
			</slot>
		</aside>
	</section>
	<footer>
		<slot name="footer">
			Recorded on {extractedOn}
		</slot>
	</footer>
</article>
{:else}
<code>Loading extract content.</code>
{/if}

<style>
	article {
		max-width: 50rem;
	}
	blockquote {
		margin: 1rem 0;
		border-bottom: 1px solid var(--divider);
		padding-bottom: 1rem;
	}
	blockquote :global(blockquote) {
		margin: 0;
		font-style: italic;
		font-size: 1.2em;
		font-family: var(--font-stack-serif);
	}
	cite {
		font-style: normal;
	}
	footer,
	aside {
		font-size: 0.85em;
		color: var(--text-secondary);
	}
	footer {
		font-style: italic;
	}
</style>
