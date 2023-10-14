import test from 'tape';
import { each } from 'template-literal-each';
import * as Exports from '../source/main';

test('main - exports', (t) => {
	const expect = ['stringify', 'TypeMapper', 'ValueMapper'];

	t.deepEqual(Object.keys(Exports), expect, `exports ${expect.join(', ')}`);

	expect.forEach((key) => {
		t.equal(typeof Exports[key], 'function', `${key} is a function`);
	});

	t.end();
});

const { stringify } = Exports;

test('main - stringify', (t) => {
	class Stringable {
		toString() {
			return 'Stringable';
		}
	}

	class NotStringable {
		key = 'value';
	}

	each`
		input                                    | output                                        | description
		-----------------------------------------|-----------------------------------------------|-------------
		${''}                                    | EmptyString                                   |
		string                                   | "string"                                      |
		${1234}                                  | 1234                                          |
		${Infinity}                              | Infinity                                      |
		${-Infinity}                             | -Infinity                                     |
		${true}                                  | true                                          |
		${false}                                 | false                                         |
		${undefined}                             | Undefined                                     |
		${null}                                  | NULL                                          |
		${Symbol('sym')}                         | Symbol(sym)                                   | Symbol('sym')
		${new Date('2020-02-20T20:02:20.202Z')}  | "2020-02-20T20:02:20.202Z"                    | new Date('2020-02-20T20:02:20.202Z')
		${/[a-z]/gi}                             | /[a-z]/gi                                     |
		${[1, 'foo', false, null]}               | [1,"foo",false,NULL]                          | [1, 'foo', false, null]
		${{ foo: 1, bar: true, baz: 'qux' }}     | {foo:1,bar:true,baz:"qux"}                    | {foo: 1, bar: true, baz: 'qux'}
		${new Stringable()}                      | Stringable                                    | new Stringable()
		${new NotStringable()}                   | {key:"value"}                                 | new NotStringable()
		${class MyClass { }}                     | Class MyClass                                 |
		${class { }}                             | AnonymousClass                                |
		${() => { }}                             | ArrowFunction                                 |
		${async () => { }}                       | AsyncArrowFunction                            | async () => {}
		${function () { }}                       | AnonymousFunction                             |
		${function* () { }}                      | AnonymousGeneratorFunction                    |
		${function myFunction() { }}             | Function myFunction                           |
		${function* myFunction() { }}            | GeneratorFunction myFunction                  |
		${{ hello: () => 'world' }}              | {hello:ArrowFunction hello}                   | { hello: () => 'world' }
		${{ hello: async () => 'world' }}        | {hello:AsyncArrowFunction hello}              | { hello: async () => 'world' }
		${{ hello() { return 'world' } }}        | {hello:ShorthandFunction hello}               | { hello() { return 'world' } }
		${{ *hello() { return 'world' } }}       | {hello:ShorthandGeneratorFunction hello}      | { *hello() { return 'world' } }
		${{ async hello() { return 'world' } }}  | {hello:ShorthandAsyncFunction hello}          | { async hello() { return 'world' } }
		${{ async *hello() { return 'world' } }} | {hello:ShorthandAsyncGeneratorFunction hello} | { async* hello() { return 'world' } }
	`(({ input, output, description = input }: any) => {
		t.equal(stringify(input), output, `${description} is ${output}`)
	});

	t.end();
});
