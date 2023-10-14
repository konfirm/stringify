import test from 'tape';
import { each } from 'template-literal-each';
import * as Exports from '../../../source/Domain/Mapper/TypeMapper';

test('Domain/Mapper/TypeMapper - exports', (t) => {
	const expect = ['TypeMapper'];

	t.deepEqual(Object.keys(Exports), expect, `exports ${expect.join(', ')}`);
	expect.forEach((key) => {
		t.equal(typeof Exports[key], 'function', `${key} is a function`);
	});

	t.end();
});

const { TypeMapper } = Exports;

test('Domain/Mapper/TypeMapper - defaults', (t) => {
	const mapper = new TypeMapper();

	each`
		input                        | output
		-----------------------------|--------
		${true}                      | boolean
		${false}                     | boolean
		${123}                       | number
		${Math.PI}                   | number
		${Infinity}                  | number
		${'string'}                  | string
		${undefined}                 | undefined
		${null}                      | object
		${[1, 2]}                    | object
		${{}}                        | object
		${/^$/}                      | object
		${new Date()}                | object
		${Symbol('sample')}          | symbol
		${() => { }}                 | function
		${async () => { }}           | function
		${function () { }}           | function
		${function* () { }}          | function
		${async function () { }}     | function
		${async function* () { }}    | function
		${function fun() { }}        | function
		${function* fun() { }}       | function
		${async function fun() { }}  | function
		${async function* fun() { }} | function
		${class MyCall { }}          | function
		${class { }}                 | function
	`(({ input, output }) => {
		t.equal(mapper.map(input), output, `${input?.toString() || 'undefined'} is "${output}"`);
	});

	t.end();
});

test('Domain/Mapper/TypeMapper - {date, regexp, integer, float, null, array}', (t) => {
	const mapper = new TypeMapper({
		date: (value: any) => value instanceof Date,
		regexp: (value: any) => value instanceof RegExp,
		integer: (value: any) => Number.isInteger(value),
		float: (value: any) => typeof value === 'number' && !Number.isInteger(value),
		null: (value: any) => value === null,
		array: (value: any) => Array.isArray(value),
	});

	each`
		input         | output
		--------------|--------
		${123}        | integer
		${Math.PI}    | float
		${Infinity}   | float
		${null}       | null
		${[1, 2]}     | array
		${/^$/}       | regexp
		${new Date()} | date
	`(({ input, output }) => {
		t.equal(mapper.map(input), output, `${input?.toString() || 'undefined'} is "${output}"`);
	});

	t.end();
});
