<style>
	nav {
		margin: var(--body-padding) var(--body-padding) 0 var(--body-padding);
		padding-bottom: var(--body-padding);
		border-bottom: 1px solid rgba(0, 0, 0, 0.25);
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: flex;
	}

	li + li {
		margin-left: 1em;
	}
</style>

<script>
	let lessons = [
		{
			id: 1,
			name: 'Introduction'
		},
		{
			id: 2,
			name: 'Reactivity'
		},
		{
			id: 3,
			name: 'Props'
		}
	];
</script>

<nav>
	<ul>
		{#each lessons as {id, name}}
		<li>
			<a href="lessons/{id}" title="Lesson {id}: {name}">{name}</a>
		</li>
		{/each}
	</ul>
</nav>
