import { TypeMapper } from './Domain/Mapper/TypeMapper';
import { ValueMapper } from './Domain/Mapper/ValueMapper';

export * from './Domain/Mapper/TypeMapper';
export * from './Domain/Mapper/ValueMapper';

const types = new TypeMapper({
	date: (value: any) => value instanceof Date,
	regexp: (value: any) => value instanceof RegExp,
	array: (value: any) => Array.isArray(value),
	null: (value: any) => value === null,
});
const stringifier = new ValueMapper(types, {
	string: (value: string): string => value ? `"${value}"` : 'EmptyString',
	date: (value: Date, map: (value: any) => string): string => map(value.toISOString()),
	object: (value: object, map: (value: any) => string): string => {
		const string = String(value);

		if (/^\[([a-z]+) \1\]$/i.test(string)) {
			const mapped = Object.keys(value)
				.map((key) => `${key}:${map(value[key])}`);
			return `{${mapped.join(',')}}`;
		}

		return string;
	},
	array: (value: Array<unknown>, map: (value: any) => string): string => `[${value.map(map).join(',')}]`,
	null: (): string => 'NULL',
	undefined: (): string => 'Undefined',
	function: (value: Function): string => {
		const { constructor: { name: cname }, name } = value;
		const [, async, generator, func] = cname.match(/^(async)?(generator)?(function)$/i);
		const [, stype, sname] = value.toString().match(/^(?:async)?(?:[\s\*]+)?(class|function)?(?:[\s\*]+)?([a-z_]\w*)?\s*[\(\{]?/i);
		const parts = []
			.concat(stype && !(name || sname) ? 'anonymous' : [])
			.concat(name && !stype && sname ? 'shorthand' : [])
			.concat(async || [], generator || [])
			.concat(!(stype || sname) ? 'arrow' : [])
			.concat(stype || func)
			.map((key) => key[0].toUpperCase() + key.slice(1));

		return [parts.join('')].concat(name || []).join(' ');
	},
});

export const stringify = (value: any): string => stringifier.map(value);
