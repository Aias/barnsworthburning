// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Mode, Chroma, Palette } from './types/Theme';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			theme?: {
				mode: Mode;
				chroma: Chroma;
				palette: Palette;
			};
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
