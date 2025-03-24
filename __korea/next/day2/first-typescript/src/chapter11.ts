// 대수 타입
// 여러개의 타입을 합성하여 새롭게 만들어낸 타입
// 합집합 타입과 교집합 타입이 존재

// 1. 합집합 - Union 타입
let a: string | number | boolean;

a = 1;
a = "hello";
a = true;

let arr: (number | string | boolean)[] = [1, "hello", true, false];

type Dog = {
  name: string;
  color: string;
};

type Person = {
  name: string;
  language: string;
}

type Union1 = Dog | Person;

let union1: Union1 = {
  name: "",
  color: ""
}

let union2: Union1 = {
  name: "",
  language: ""
}

let union3: Union1 = {
  name: "",
  language: "",
  color: ""
}

// 2. 교집합 타입 - Intersection 타입
let variable : number & string; // => never

type Intersection = Dog & Person;

// 교집합 타입은 교집합 되는 객체의 모든 속성을 가지지 않으면 에러 발생
// 다 가지고 있어야 함
let intersection : Intersection = {
  name: "",
  color: "",
  language: ""
}
