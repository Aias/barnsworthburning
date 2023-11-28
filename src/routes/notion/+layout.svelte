<script>
	import '$styles/app.css';
	import exists from '$helpers/exists';
	import { page } from '$app/stores';

	import Header from '$components/Header.svelte';
	import Index from '$components/NotionIndex.svelte';

	let { data } = $props();

	const notionPropTypes = {
		title: {
			map: (title = []) => {
				return title
					.map((text) => {
						return text.plain_text;
					})
					.join('');
			}
		},
		last_edited_time: {
			map: (val) => {
				return new Date(val);
			}
		},
		created_time: {
			map: (val) => {
				return new Date(val);
			}
		},
		select: {
			map: (val) => {
				return val.name;
			}
		},
		rollup: {
			map: (val) => {
				return val[val.type];
			}
		},
		relation: {
			map: (val) => {
				return val.map((item) => {
					return item.id;
				});
			}
		}
	};

	$effect(() => {
		const mapped = data?.creators.map((page) => {
			const properties = page.properties;
			const propertyKeys = Object.keys(properties);
			const mappedProperties = propertyKeys.reduce((acc, key) => {
				const property = properties[key];
				const type = property.type;
				const map = notionPropTypes[type]?.map;
				const value = map ? map(property[type]) : property;
				return {
					...acc,
					[key]: value
				};
			}, {});
			return mappedProperties;
		});
		console.log(mapped);
	});

	let muteLinks = $derived(exists($page?.params.extractId));
</script>

<Header class="app-header" />
<main class="app-content">
	<Index class={`index ${muteLinks ? 'unthemey' : ''}`} />
	<article class="extract-panel chromatic"><slot /></article>
</main>

<style lang="scss" global>
	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
		flex: 0 0 auto;
	}
	.app-content {
		padding: var(--padding);
		display: flex;
		flex-direction: row;
		gap: var(--padding);
		height: 100%;
		flex-grow: 1;
		overflow: hidden;
		align-items: stretch;

		> * {
			overflow-y: auto;
		}
	}
	.extract-panel {
		padding: var(--padding);
		margin: calc(-1 * var(--padding));
		margin-left: 0;
		background-color: var(--background);
		border-left: 1px solid var(--edge);
		width: 30rem;

		&:empty {
			display: none;
		}
	}
</style>
