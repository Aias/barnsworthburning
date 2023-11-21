<script>
	export let href = '/',
		label,
		count,
		active,
		onClick;
</script>

<li class:active class="index-item">
	<a href="/recYQmlvBMSUV0Pe0" on:click={onClick}>{label}</a>&nbsp;<span class="count">{count}</span>
</li>

<style lang="scss">
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
