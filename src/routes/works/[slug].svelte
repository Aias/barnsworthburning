<script context="module">
	import { FULL_API } from '../../config';

	export async function preload(page, session) {
		const { params, query } = page;

		let { slug } = params;

		let options = {
			view: 'Grid view',
			filterByFormula: `ARRAYJOIN(group_slug, '') = '${slug}'`
		};

		let extracts = await this.fetch(
			`${FULL_API}/airtableGet?base=commonplace&table=extracts&options=${JSON.stringify(
				options
			)}`
		)
			.then(data => data.json())
			.catch(error => {
				console.log(error);
				return [];
			});

		return { extracts, slug };
	}
</script>

<script>
	import { onMount, afterUpdate, tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import Extract from '../../components/Extract.svelte';

	export let extracts = undefined;
	export let slug = undefined;

	let currentWork;

	onMount(async () => {
		let options = {
			filterByFormula: `slug = '${slug}'`
		};

		let work = await fetch(
			`${FULL_API}/airtableGet?base=commonplace&table=groups&options=${JSON.stringify(
				options
			)}`)
			.then(data => data.json())
			.catch(error => {
				console.log(error);
				return [];
			});
		
		currentWork = work[0];
	})

	const scrollToSelectedExtract = async () => {
		await tick();
		try {
			const anchor = window.location.hash;

			if(anchor) {
				const el = document.getElementById(anchor.slice(1));
				el.scrollIntoView({
						behavior: 'smooth'
					});
			}
			else {
				document.querySelector("main")
					.scrollTo({
						top: 0,
						behavior: 'auto'
					});
			}
		}
		catch(error) {
			console.log(error);
		}
	}

	const isFirstLetterAVowel = (str = '') => {
		if(str.length <= 0) return false;
		else {
			const firstLetter = str[0].toLowerCase();
			const vowels = ['a','e','i','o','u'];
			if(vowels.indexOf(firstLetter) >= 0) {
				return true;
			}
			else {
				return false;
			}
		}
	}

	afterUpdate(scrollToSelectedExtract);
</script>

{#if currentWork}
<header in:slide>
	<h1>{currentWork.name}</h1>
	<p class="text-secondary">
		<em>
			<span>{isFirstLetterAVowel(currentWork.type) ? 'An' : 'A'}</span>
			<span>{currentWork.type.toLowerCase()}</span>
			<span>by</span>
			{#each currentWork.creator_names as name, i}{i > 0 ? i + 1 === currentWork.creator_names.length ? ' & ' : ', ': ''}<span>{name}</span>{/each}
		</em>
	</p>
</header>
{/if}
{#each extracts as extract}
	<Extract {extract} listed />
{/each}

<style>
	header {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: var(--container-border);
		max-width: var(--reading-width-wide);
		position: sticky;
		top: 0;
		background-color: var(--layer-bg);
	}

	p {
		margin-top: 0.5rem;
	}

	:global(.listed + .listed:before) {
		content: '∵';
		display: block;
		margin-top: 1.5rem;
		margin-bottom: 1rem;
		text-align: center;
		color: var(--text-tertiary);
	}
</style>
