// 배열
let numArr : number[] = [1, 2, 3];

let strArr : string[] = ["hello", "hi"];

// 재네릭 문법
let boolArr: Array<boolean> = [true, true, false];
let stringArr: Array<string> = ["hello", "hi"];

// 배열에 들어가는 요소의 타입이 다양한 경우
let multiArr: (string | number)[] = [1, "hello"];

let a: (string | number) = 1;

// 다차원 배열 => 겹치는 배열 개수만큼 [] 정의
let doubleArr: number[][] = [
  [1, 2, 3],
  [4, 5]
]

// 튜플
// 길이와 타입이 고정된 배열
let tup1: [string, number] = ["문자", 2];
tup1 = ["문자", 123];

let tup2: [number, string, boolean] = [1, "2", true];
// tup2 = ["3", 3, false] // 오류 => 앞에 숫자가 와야함

// 취약점 및 주의점: push나 pop등은 자바스크립트라서 길이가 변동 될 수 있음
tup2.push(1);
console.log(tup2); // [ 1, '2', true, 1 ] 

tup2.pop();
tup2.pop();
console.log(tup2); // [ 1, '2' ] 

const users: [string, number][] = [
  ["홍길동", 1],
  ["바보", 2],
  ["오잉", 3],
]