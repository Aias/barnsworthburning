<script lang="ts">
	import { page } from '$app/state';
	import Link from '$components/Link.svelte';
	import { sectionIcons, sections } from '$lib/records';
	import { LibraryBigIcon, SearchIcon, type LucideIcon } from '@lucide/svelte';

	let { ...restProps } = $props();

	interface Route {
		name: string;
		path: string;
		icon: LucideIcon;
	}
	const routes: Route[] = [
		{ name: 'Index', path: '/', icon: LibraryBigIcon },
		...Object.values(sections).map((section) => ({
			name: section.label,
			path: `/${section.path}`,
			icon: sectionIcons[section.type]
		})),
		{ name: 'Search', path: '/search', icon: SearchIcon }
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
		<Link class="nav-link" active={route === activeRoute} href={route.path}>
			<route.icon /><span class="nav-link__label">{route.name}</span></Link
		>
	{/each}
</nav>
