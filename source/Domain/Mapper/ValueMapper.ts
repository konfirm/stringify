import { TypeMapper, TypeMapping } from "./TypeMapper";

export type ValueMapping<T = string> = {
	[key: keyof TypeMapping]: (value: any, map: (value: any) => T) => T;
}

export class ValueMapper<T extends unknown = unknown> {
	constructor(private types: TypeMapper = new TypeMapper(), private mapping: ValueMapping<T> = {}) { }

	map(value: any): T {
		const type = this.types.map(value);
		const map = (value: any) => this.map(value);

		return type in this.mapping
			? this.mapping[type](value, map)
			: value?.toString() || 'undefined' as T;
	}
}
