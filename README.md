![tests](https://github.com/konfirm/stringify/actions/workflows/tests.yml/badge.svg)
![release](https://github.com/konfirm/stringify/actions/workflows/release.yml/badge.svg)

# Stringify


## Installation

```
npm install --save @konfirm/stringify
```

Or use your favorite package manager to install `@konfirm/stringify`

## API

### Exports

| name           | description                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------- |
| `TypeMapper`   | A Mapper to determine the type of a variable                                                    |
| `TypeMapping`  | _TypeScript_ the expected mapping object structure as argument for `TypeMapper`                 |
| `ValueMapper`  | A Mapper to format the value of a variable                                                      |
| `ValueMapping` | _TypeScript_ the expected mapping object structure as argument for `TypeMapper`                 |
| `stringify`    | A preconstructed `ValueMapping` instance, configured to deal with most variable types in detail |

### `TypeMapper`
A Mapper to map variable type names. The default behavior is to use the `typeof` operator, this approach also acts as a last resort, should none of the provided mapping match the variable.

```js
// const { TypeMapper } = require('@konfirm/stringify');
import { TypeMapper } from '@konfirm/stringify';

const mapper = new TypeMapper({
	date: (value) => value instanceof Date,
});

console.log(mapper.map('example'));  // string
console.log(mapper.map(new Date())); // date
console.log(mapper.map([1, 'two'])); // object
```

### `ValueMapper`
A Mapper to map variable values. It determines the types using an instance of TypeMapper as the first argument, and applies mappings defined in the mapping object provided as second argument. If no mapper is present for the (mapped) type, the `.toString()` function will be called on the value.

```js
// const { TypeMapper, ValueMapper } = require('@konfirm/stringify');
import { TypeMapper, ValueMapper } from '@konfirm/stringify';

const types = new TypeMapper({
	date: (value) => value instanceof Date,
});
const mapper = new ValueMapper(types, {
	string: (value) => `"${value}"`,
	date: (value, map) => map(value.toISOString()),
	array: (value, map) => `[${value.map(map).join(',')}]`,
});

console.log(mapper.map('example'));  // "map"
console.log(mapper.map(new Date())); // "2020-11-30T10:20:30.000Z"
console.log(mapper.map([1, 'two'])); // [1,"two"]
```

### `stringify`
A preconstructed instance of `ValueMapping`, configured to deal with most variable types in detail.

```js
// const { stringify } = require('@konfirm/stringify');
import { stringify } from '@konfirm/stringify';

console.log(stringify(() => {})); // ArrowFunction
```

#### Mappings

| input                                   | output                                          | remark                                                                                                                       |
| --------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `''`                                    | `EmptyString`                                   |                                                                                                                              |
| `'string'`                              | `"string"`                                      |                                                                                                                              |
| `1234`                                  | `1234`                                          |                                                                                                                              |
| `Infinity`                              | `Infinity`                                      |                                                                                                                              |
| `-Infinity`                             | `-Infinity`                                     |                                                                                                                              |
| `true`                                  | `true`                                          |                                                                                                                              |
| `false`                                 | `false`                                         |                                                                                                                              |
| `undefined`                             | `Undefined`                                     |                                                                                                                              |
| `null`                                  | `NULL`                                          |                                                                                                                              |
| `Symbol('sym')`                         | `Symbol(sym)`                                   |                                                                                                                              |
| `new Date('2020-02-20T20:02:20.202Z')`  | `"2020-02-20T20:02:20.202Z"`                    |                                                                                                                              |
| `/[a-z]/gi`                             | `/[a-z]/gi`                                     |                                                                                                                              |
| `[1, 'foo', false, null]`               | `[1,"foo",false,NULL]`                          |                                                                                                                              |
| `{ foo: 1, bar: true, baz: 'qux' }`     | `{foo:1,bar:true,baz:"qux"}`                    |                                                                                                                              |
| `new Stringable()`                      | `Stringable`                                    |                                                                                                                              |
| `new NotStringable()`                   | `{key:"value"}`                                 |                                                                                                                              |
| `class MyClass { }`                     | `Class MyClass`                                 | TypeScript target below `ES2015`/`ES6` outputs `Function MyClass`                                                            |
| `class { }`                             | `AnonymousClass`                                | TypeScript target below `ES2015`/`ES6` outputs `Function class_[0-9]+`                                                       |
| `() => { }`                             | `ArrowFunction`                                 | TypeScript target below `ES2017` outputs `AnonymousFunction`                                                                 |
| `async () => { }`                       | `AsyncArrowFunction`                            | TypeScript target below `ES2017` outputs `AnonymousFunction`                                                                 |
| `function () { }`                       | `AnonymousFunction`                             |                                                                                                                              |
| `function* () { }`                      | `AnonymousGeneratorFunction`                    | TypeScript target below `ES2015`/`ES6` outputs `AnonymousFunction`                                                           |
| `function myFunction() { }`             | `Function myFunction`                           |                                                                                                                              |
| `function* myFunction() { }`            | `GeneratorFunction myFunction`                  | TypeScript target below `ES2015`/`ES6` outputs `Function`                                                                    |
| `{ hello: () => 'world' }`              | `{hello:ArrowFunction hello}`                   |                                                                                                                              |
| `{ hello: async () => 'world' }`        | `{hello:AsyncArrowFunction hello}`              | TypeScript target below `ES2015`/`ES6` outputs `{hello: Function}`, below `ES2017` outputs `{hello:ArrowFunction}`           |
| `{ hello() { return 'world' } }`        | `{hello:ShorthandFunction hello}`               | TypeScript target below `ES2015`/`ES6` outputs `{hello: Function}`                                                           |
| `{ *hello() { return 'world' } }`       | `{hello:ShorthandGeneratorFunction hello}`      | TypeScript target below `ES2015`/`ES6` outputs `{hello: Function}`                                                           |
| `{ async hello() { return 'world' } }`  | `{hello:ShorthandAsyncFunction hello}`          | TypeScript target below `ES2015`/`ES6` outputs `{hello: Function}`, below `ES2017` outputs `{hello:ShorthandFunction hello}` |
| `{ async *hello() { return 'world' } }` | `{hello:ShorthandAsyncGeneratorFunction hello}` | TypeScript target below `ES2015`/`ES6` outputs `{hello: Function}`, below `ES2018` outputs `{hello:ShorthandFunction hello}` |


## License
MIT License Copyright (c) 2021 Rogier Spieker (Konfirm)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
