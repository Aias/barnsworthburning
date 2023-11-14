<svelte:options runes={true} />

<script>
	import { getContext, setContext } from 'svelte';
	let { mode: propsMode, palette: propsPalette, chroma: propsChroma } = $props();

	let contextMode = getContext('mode');
	let contextPalette = getContext('palette');
	let contextChroma = getContext('chroma');

	let mode = $derived(propsMode || contextMode);
	setContext('mode', mode);

	let palette = propsPalette || contextPalette;
	setContext('palette', palette);

	let chroma = propsChroma || contextChroma;
	setContext('chroma', chroma);

	let themeClass = `${mode} ${palette} ${chroma}`;
</script>

<section class={themeClass}>
	<table>
		<thead>
			<tr>
				<th>Theme Key</th>
				<th>Props</th>
				<th>Context</th>
				<th>Final</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Mode:</td>
				<td>{propsMode}</td>
				<td>{contextMode}</td>
				<td>{mode}</td>
			</tr>
			<tr>
				<td>Palette:</td>
				<td>{propsPalette}</td>
				<td>{contextPalette}</td>
				<td>{palette}</td>
			</tr>
			<tr>
				<td>Chroma:</td>
				<td>{propsChroma}</td>
				<td>{contextChroma}</td>
				<td>{chroma}</td>
			</tr>
		</tbody>
	</table>
	<p>
		<slot />
	</p>
</section>


<style>
	section {
		background-color: var(--container);
		color: var(--primary);
		border: 1px solid var(--divider);
		padding: 0.5rem;
		border-radius: 4px;
	}
	table {
		border-collapse: collapse;
	}
	thead, tbody td:first-of-type {
		background-color: var(--splash);
	}
	th, td {
		border: 1px solid var(--divider);
		text-align: start;
		padding: 2px 6px;
	}
	tbody td {
		color: var(--display);
	}
	:is(th, td):first-of-type {
		color: var(--accent);
		font-weight: bold;
	}
	p:not(:empty) {
		margin-top: 1rem;
	}
</style>