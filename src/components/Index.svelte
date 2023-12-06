<script>
	let { entries, class: className } = $props();

	let selectedEntity = $state();
</script>

<nav class={className} class:index-container={true}>
	<menu>
		{#snippet settingsItem({ active, labelPrefix, label, onClick})}
		<li class:active class="settings-item unthemey">
			<button class="settings-button link" on:click={onClick}>
				<span class="label-prefix">{labelPrefix}</span>{label}
			</button>
		</li>
		{/snippet}
		
		{#snippet indexEntry({ type, id, label, count, active, onClick})}
		<li class:active class="index-item">
			<a href={`?${type}=${id}`} on:click={onClick}>{label}</a>&nbsp;<span class="count">{count}</span>
		</li>
		{/snippet}

		{#snippet sectionSeparator()}
		<li class="center text-hint">⁘&#8199;&#8199;⁘&#8199;&#8199;⁘</li>
		{/snippet}

		{#each entries as entry (entry.id)}
			{@render indexEntry({ ...entry, active: entry.id === selectedEntity, onClick: () => { selectedEntity = entry.id; } })}
		{/each}
		{@render sectionSeparator()}
		<li>
			<a href="./">About</a>
		</li>
		<li>
			<a href="/feed.xml" target="_blank" rel="noreferrer">RSS Feed</a>
		</li>
		<li>
			<a href="https://github.com/Aias/barnsworthburning" target="_blank" rel="noreferrer">Source</a>
		</li>
	</menu>
</nav>

<style lang="scss">
	.index-container {
		--cantilever: 0.5rem;
		--border-width: 0.25rem;
		flex: 1;
		overflow-y: auto;
		padding: 0 calc(var(--cantilever) + var(--border-width));
		margin: 0 calc(-1 * var(--cantilever) + var(--border-width));
	}

	menu {
		margin: 0 0 0 calc(-1 * var(--cantilever));
		padding: 0;
		list-style-type: none;
		column-width: 23ch;
		column-gap: var(--padding);
		font-size: var(--font-size-small);
	}

	menu > li {
		--indent: 1em;
		padding-left: calc(var(--indent) + var(--cantilever));
		padding-right: var(--cantilever);
		padding-top: 1px;
		padding-bottom: 1px;
		text-indent: calc(-1 * var(--indent));
		transition: background-color 0.25s;
	}

	.settings-item {
		.settings-button {
			white-space: nowrap;
			text-decoration: none;
		}
		.label-prefix {
			padding-right: 1ch;
			visibility: hidden;
		}

		&.active {
			border-left: var(--border-width) solid var(--main);
			margin-left: calc(-1 * var(--border-width));
			.settings-button {
				color: var(--link);
				font-weight: 500;
			}
			.label-prefix {
				visibility: visible;
			}
		}
	}

	.index-item {
		.count {
			margin-left: 1em;
			text-align: right;
			color: var(--secondary);
			opacity: 0.25;
			transition: opacity 150ms;
		}
		&.active {
			background-color: var(--main);
			:global(a) {
				color: var(--main-contrast);
			}
			.count {
				color: var(--main-contrast);
				opacity: 0.75;
			}
		}
		&:hover {
			.count {
				opacity: 1;
			}
		}
	}
</style>
