type prettifyOptions = {
	indent: number;
	newline: string;
};
declare module 'prettify-xml' {
	export default function prettifyXml(xml: string, options: prettifyOptions): string;
}
