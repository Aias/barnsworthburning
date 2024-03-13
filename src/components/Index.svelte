<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { entityTypes } from '$helpers/params';
</script>

<div class="index">
	<section>
		<h3>{entityTypes.creator.plural}</h3>
		<ul>
			{#each cache.allCreators as creator}
				<li>
					<a class="name" href={`/creators/${creator.id}`}>{creator.name}</a>
					<span class="count">{creator.numExtracts}</span>
				</li>
			{/each}
		</ul>
	</section>
	<section>
		<h3>{entityTypes.space.plural}</h3>
		<ul class="spaces">
			{#each cache.allSpaces as space}
				<li>
					<a class="name" href={`/space/${space.id}`}>{space.topic}</a>
					<span class="count">{space.extracts?.length ?? 0}</span>
				</li>
			{/each}
		</ul>
	</section>
	<section>
		<h3>{entityTypes.extract.plural}</h3>
		<ul class="extracts">
			{#each cache.allExtracts as extract}
				<li>
					<a class="name" href={`/extracts/${extract.id}`}>{extract.title}</a>
					<span class="count"
						>{extract.creators
							? extract.creators.map((c) => c.name).join(', ')
							: 'Unknown'}</span
					>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style lang="scss">
	.index {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	.looseleaf {
		flex: 1 0 auto;
		max-height: 25vh;
		overflow-y: auto;
		font-size: 0.25em;
	}
	section {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}
	ul {
		--gap: 0.5em;
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		column-gap: 0.5em;
	}
	li:not(:last-child)::after {
		content: '/';
		margin-left: var(--gap);
		color: var(--divider);
	}
	.spaces .name {
		text-transform: lowercase;
	}
	.count {
		color: var(--hint);
		padding-left: 0.25em;
	}
</style>
