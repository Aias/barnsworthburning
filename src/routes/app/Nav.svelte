<script lang="ts">
	import { page } from '$app/state';
	import Link from '$components/Link.svelte';
	import { sections } from '$lib/records';

	let { ...restProps } = $props();

	interface Route {
		name: string;
		path: string;
		icon: string;
	}
	const routes: Route[] = [
		{ name: 'Index', path: '/', icon: '🗂️' },
		...Object.values(sections).map((section) => ({
			name: section.label,
			path: `/${section.path}`,
			icon: section.icon
		})),
		{ name: 'Search', path: '/search', icon: '🔍' }
	];

	let activeRoute = $derived.by(() => {
		const currentRoute = page.url.pathname;
		const [indexRoute, ...otherRoutes] = routes;
		if (!currentRoute) return undefined;
		if (currentRoute === '/') return indexRoute;
		return otherRoutes.find((route) => currentRoute.startsWith(route.path));
	});
</script>

<nav {...restProps}>
	{#each routes as route (route.path)}
		<Link class="nav-link" active={route === activeRoute} href={route.path} data-icon={route.icon}
			>{route.name}</Link
		>
	{/each}
</nav>
