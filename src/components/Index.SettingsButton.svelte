<script>
	export let selected, labelPrefix, label, onClick;
</script>

<li class:selected class="settings-item unthemey">
	<button class="settings-button link" on:click={onClick}>
		<span class="label-prefix">{labelPrefix}</span>{label}
	</button>
</li>

<style lang="scss">
	.settings-item {
		.settings-button {
			white-space: nowrap;
			text-decoration: none;
		}
		.label-prefix {
			padding-right: 1ch;
			visibility: hidden;
		}

		&.selected {
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
</style>
