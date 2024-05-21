export enum Palette {
	Gray = 'gray',
	Mauve = 'mauve',
	Slate = 'slate',
	Sage = 'sage',
	Olive = 'olive',
	Sand = 'sand',
	Gold = 'gold',
	Bronze = 'bronze',
	Brown = 'brown',
	Yellow = 'yellow',
	Amber = 'amber',
	Orange = 'orange',
	Tomato = 'tomato',
	Red = 'red',
	Ruby = 'ruby',
	Crimson = 'crimson',
	Pink = 'pink',
	Plum = 'plum',
	Purple = 'purple',
	Violet = 'violet',
	Iris = 'iris',
	Indigo = 'indigo',
	Blue = 'blue',
	Cyan = 'cyan',
	Teal = 'teal',
	Jade = 'jade',
	Green = 'green',
	Grass = 'grass',
	Lime = 'lime',
	Mint = 'mint',
	Sky = 'sky'
}
export type Neutral =
	| Palette.Gray
	| Palette.Slate
	| Palette.Sand
	| Palette.Mauve
	| Palette.Olive
	| Palette.Sage;

export const paletteOptions: Palette[] = [
	Palette.Tomato,
	Palette.Ruby,
	Palette.Violet,
	Palette.Indigo,
	Palette.Sky,
	Palette.Jade,
	Palette.Grass,
	Palette.Amber,
	Palette.Gold,
	Palette.Gray
];

export const neutralsMap: Record<Neutral, Palette[]> = {
	[Palette.Gray]: [Palette.Gray],
	[Palette.Mauve]: [
		Palette.Mauve,
		Palette.Tomato,
		Palette.Red,
		Palette.Ruby,
		Palette.Crimson,
		Palette.Pink,
		Palette.Plum,
		Palette.Purple,
		Palette.Violet
	],
	[Palette.Slate]: [
		Palette.Slate,
		Palette.Iris,
		Palette.Indigo,
		Palette.Blue,
		Palette.Sky,
		Palette.Cyan
	],
	[Palette.Sage]: [Palette.Sage, Palette.Mint, Palette.Teal, Palette.Jade, Palette.Green],
	[Palette.Olive]: [Palette.Olive, Palette.Grass, Palette.Lime],
	[Palette.Sand]: [
		Palette.Sand,
		Palette.Yellow,
		Palette.Amber,
		Palette.Orange,
		Palette.Brown,
		Palette.Bronze,
		Palette.Gold
	]
};

export enum Shade {
	White = 'white',
	Black = 'black'
}

export enum Mode {
	Auto = 'auto',
	Light = 'light',
	Dark = 'dark'
}

export enum Chroma {
	Neutral = 'neutral',
	Chromatic = 'chromatic'
}
