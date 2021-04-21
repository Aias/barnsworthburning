export async function getSession({ context }) {
	return {
		activeWindow: 'index', // index, gallery, panel
		activeParams: {},
		indexLoaded: false
	};
}
