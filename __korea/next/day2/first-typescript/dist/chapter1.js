// number
let num1 = 123;
let num2 = -123;
let num3 = 0.123;
let num4 = -0.123;
let num5 = Infinity; // 무한대
let num6 = -Infinity; // 음의 무한대
let num7 = NaN;
// num1 = "hello"; // 오류 => string 값이 들어옴
// num1.toUpperCase(); // 오류 => toUpperCase(): string형에서 대문자로 변환
num1.toFixed(); // toFixed(): number형 소수점 제거
// string
let str1 = "hello";
let str2 = 'hello';
let str3 = `hello`;
let str4 = `hello ${str1}`;
// str1.toFixed();
console.log(str1.toUpperCase());
// boolean
let bool1 = true;
let bool2 = false;
// null
let null1 = null;
// null1 = 1; // 오류
// undefined
let unde1 = undefined;
// strictNullChecks 옵션을 false를 주어야 에러가 사라짐 (tsconfig.json)
let numNull = null;
// 리터럴 타입
// 리터럴 -> 값
// 해당하는 값만 가질 수 있음
let numA = 10; // 10 값만 들어갈 수 있음
let boolA = true; // true만 들어갈 수 있음
let strA = "hello";
export {};
