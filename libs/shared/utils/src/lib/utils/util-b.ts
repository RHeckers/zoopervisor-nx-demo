// export function sayHelloFromB() {
//   return 'Hello from B'
// }

// export class TestUtilB {
//   static #map = { a: 1 }
//   static sayHello() {
//     return this.#map.a;
//   }
// }

// const max = Math.max(1, 2, 3, 4, 5);


// const someArray = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];

// const someMappedArry = someArray.map((item) => {
//   return {
//     name: item.name.toUpperCase(),
//     age: item.age + 1,
//   };
// });

// export function getMappedArray() {
//   return someMappedArry;
// }

const ZONES = ['savanna', 'aviary', 'aquarium'];

export const ZONE_LABELS =
  ZONES.map((z) => z.replace('-', ' '));

export function isZone(value: string) {
  return ZONES.includes(value);
}
