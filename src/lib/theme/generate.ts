import { THEME_CONFIG } from './config';
import { promises as fs } from 'fs';
import path from 'path';

export async function generateThemeScript() {
	const script = `// Auto-generated from src/lib/theme/config.ts - DO NOT EDIT
(function() {
  const COOKIES = ${JSON.stringify(THEME_CONFIG.cookies)};
  const DEFAULTS = ${JSON.stringify(THEME_CONFIG.defaults)};
  
  function getCookie(name) {
    return (
      document.cookie
        .split(';')
        .find((c) => c.trim().startsWith(name + '='))
        ?.split('=')[1]
        .trim() || null
    );
  }
  
  function setClass(key) {
    const value = getCookie(COOKIES[key.toLowerCase()]) || DEFAULTS[key.toLowerCase()];
    document.documentElement.classList.add(value);
  }
  
  setClass('MODE');
  setClass('CHROMA');
  setClass('PALETTE');
})();`;

	await fs.writeFile(path.resolve('./static/themePreferences.js'), script);
}
