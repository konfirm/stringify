export type TypeMapping = {
	[key: string]: (value: any) => boolean;
};

export class TypeMapper {
	private readonly mapping: Array<(value: any) => string | undefined>;

	constructor(mapping: TypeMapping = {}) {
		this.mapping = Object.keys(mapping)
			.map((key) => (value: any) => mapping[key](value) ? key : undefined)
			.concat((value: any) => typeof value);
	}

	map(value: unknown): string {
		return this.mapping.reduce((carry: string | undefined, map) => carry || map(value), undefined);
	}
}
