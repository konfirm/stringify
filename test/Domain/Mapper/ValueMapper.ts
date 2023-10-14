import test from 'tape';
import { each } from 'template-literal-each';
import * as Exports from '../../../source/Domain/Mapper/ValueMapper';
import { TypeMapper } from '../../../source/main';

test('Domain/Mapper/ValueMapper - exports', (t) => {
	const expect = ['ValueMapper'];

	t.deepEqual(Object.keys(Exports), expect, `exports ${expect.join(', ')}`);
	expect.forEach((key) => {
		t.equal(typeof Exports[key], 'function', `${key} is a function`);
	});

	t.end();
});

const { ValueMapper } = Exports

test('Domain/Mapper/ValueMapper - defaults', (t) => {
	const mapper = new ValueMapper();

	each`
		input                        | output
		-----------------------------|--------
		${true}                      | true
		${false}                     | false
		${123}                       | 123
		${Math.PI}                   | 3.141592653589793
		${Infinity}                  | Infinity
		${'sample'}                  | sample
		${undefined}                 | undefined
		${null}                      | undefined
		${[1, 2]}                    | 1,2
		${{}}                        | [object Object]
		${/^$/}                      | /^$/
		${Symbol('sample')}          | Symbol(sample)
		${() => { }}                 | () => { }
		${async () => { }}           | async () => { }
		${function () { }}           | function () { }
		${function* () { }}          | function* () { }
		${async function () { }}     | async function () { }
		${async function* () { }}    | async function* () { }
		${function fun() { }}        | function fun() { }
		${function* fun() { }}       | function* fun() { }
		${async function fun() { }}  | async function fun() { }
		${async function* fun() { }} | async function* fun() { }
	`(({ input, output }) => {
		t.equal(mapper.map(input), output, `${input?.toString() || 'undefined'} is "${output}"`);
	});

	t.end();
});

test('Domain/Mapper/ValueMapper - {date, regexp, integer, float, null, array}', (t) => {
	const types = new TypeMapper({
		date: (value: any) => value instanceof Date,
		regexp: (value: any) => value instanceof RegExp,
		integer: (value: any) => Number.isInteger(value),
		float: (value: any) => typeof value === 'number' && !Number.isInteger(value),
		null: (value: any) => value === null,
		array: (value: any) => Array.isArray(value),
	});
	const mapper = new ValueMapper(types, {
		string: (value) => `"${value}"`,
		date: (value, map) => map(value.toISOString()),
		float: (value) => value.toFixed(4),
		array: (value, map) => `[${value.map(map).join(',')}]`,
		null: () => 'NULL',
	});

	each`
		input                               | output
		------------------------------------|--------
		${123}                              | 123
		${Math.PI}                          | 3.1416
		${Infinity}                         | Infinity
		${null}                             | NULL
		${[1, 2]}                           | [1,2]
		${/^$/}                             | /^$/
		${new Date('2020-11-30T10:20:30Z')} | "2020-11-30T10:20:30.000Z"
	`(({ input, output }) => {
		t.equal(mapper.map(input), output, `${input?.toString() || 'undefined'} is "${output}"`);
	});

	t.end();
});

