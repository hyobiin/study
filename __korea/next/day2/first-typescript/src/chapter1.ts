// number
let num1: number = 123;
let num2: number = -123;
let num3: number = 0.123;
let num4: number = -0.123;
let num5: number = Infinity; // 무한대
let num6: number = -Infinity; // 음의 무한대
let num7: number = NaN;

// num1 = "hello"; // 오류 => string 값이 들어옴
// num1.toUpperCase(); // 오류 => toUpperCase(): string형에서 대문자로 변환
num1.toFixed(); // toFixed(): number형 소수점 제거

// string
let str1: string = "hello";
let str2: string = 'hello';
let str3: string = `hello`;
let str4: string = `hello ${str1}`;

// str1.toFixed();
console.log(str1.toUpperCase())

// boolean
let bool1: boolean = true;
let bool2: boolean = false;

// null
let null1: null = null;

// null1 = 1; // 오류

// undefined
let unde1 : undefined = undefined;

// strictNullChecks 옵션을 false를 주어야 에러가 사라짐 (tsconfig.json)
let numNull : number = null;

// 리터럴 타입
// 리터럴 -> 값
// 해당하는 값만 가질 수 있음
let numA: 10 = 10; // 10 값만 들어갈 수 있음

let boolA: true = true; // true만 들어갈 수 있음

let strA: "hello" = "hello";