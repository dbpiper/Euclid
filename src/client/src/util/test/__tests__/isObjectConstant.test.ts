import isObjectConstant from '../isObjectConstant';

describe('make sure it fails on non-constant objects', () => {
  test('empty is not constant', () => {
    expect(isObjectConstant({})).toBe(false);
  });

  test('misc object is not constant', () => {
    // we are deliberately checking various non-constant cases
    // `let` is one of them...
    // tslint:disable-next-line: prefer-const
    let myObj = {
      myMessage: 'hello world!',
      myNum: 42,
      myBool: true,
    };
    expect(isObjectConstant(myObj)).toBe(false);
  });

  test('misc const object is not constant', () => {
    const myObj = {
      myMessage: 'hello world!',
      myNum: 42,
      myBool: true,
    };
    expect(isObjectConstant(myObj)).toBe(false);
  });

  test('const object that is frozen is not constant...', () => {
    const myObj = Object.freeze({
      myMessage: 'hello world!',
      myNum: 42,
      myBool: true,
    });
    expect(isObjectConstant(myObj)).toBe(false);
  });

  test('constant object with non-constant object as child is not constant', () => {
    const myObj = Object.freeze({
      __proto__: null,
      myMessage: 'hello world!',
      myNum: 42,
      myBool: true,
      myNonConstChild: {
        myFloat: 3.14,
        myColor: 'blue',
      },
    });
    expect(isObjectConstant(myObj)).toBe(false);
  });

  test('constant object with non-constant frozen object as child is not constant', () => {
    const myObj = Object.freeze({
      __proto__: null,
      myMessage: 'hello world!',
      myNum: 42,
      myBool: true,
      myNonConstChild: Object.freeze({
        myFloat: 3.14,
        myColor: 'blue',
      }),
    });
    expect(isObjectConstant(myObj)).toBe(false);
  });

  test('constant object with const child, but non-const grand-child is not constant', () => {
    const myObj = Object.freeze({
      __proto__: null,
      myMessage: 'hello world!',
      myNum: 42,
      myBool: true,
      myConstChild: Object.freeze({
        __proto__: null,
        myFloat: 3.14,
        myColor: 'blue',
        myNonConstGrandChild: Object.freeze({
          myFloat: 3.14,
          myColor: 'blue',
        }),
      }),
    });
    expect(isObjectConstant(myObj)).toBe(false);
  });
});

// const cases

describe('make sure it works on constant objects', () => {
  test('empty constant obj', () => {
    const myEmptyObj = Object.freeze({
      __proto__: null,
    });
    expect(isObjectConstant(myEmptyObj)).toBe(true);
  });

  test('misc object is constant', () => {
    const myObj = Object.freeze({
      __proto__: null,
      myMessage: 'hello world!',
      myNum: 42,
      myBool: true,
    });
    expect(isObjectConstant(myObj)).toBe(true);
  });

  test('constant object with a constant child is constant', () => {
    const myObj = Object.freeze({
      __proto__: null,
      myMessage: 'hello world!',
      myNum: 42,
      myBool: true,
      myConstChild: Object.freeze({
        __proto__: null,
        myFloat: 3.14,
        myColor: 'blue',
      }),
    });
    expect(isObjectConstant(myObj)).toBe(true);
  });

  test('constant object with a constant grand-child is constant', () => {
    const myObj = Object.freeze({
      __proto__: null,
      myMessage: 'hello world!',
      myNum: 42,
      myBool: true,
      myConstChild: Object.freeze({
        __proto__: null,
        myFloat: 3.14,
        myColor: 'blue',
        iAmAlsoConst: Object.freeze({
          __proto__: null,
          myFloat: 3.14,
          myColor: 'blue',
        }),
      }),
    });
    expect(isObjectConstant(myObj)).toBe(true);
  });
});

export {};
