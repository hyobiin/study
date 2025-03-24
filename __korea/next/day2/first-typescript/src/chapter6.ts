// any
// 특정 변수의 타입을 우리가 확실히 모를 때
// 자바스크립트랑 사용성이 비슷 (타입을 지정해도 대부분의 값이 올 수 있기 때문에)
// 타입스크립트에서는 잘 쓰지 않길 바람

let anyVar: any = 10;
anyVar = "hello";
anyVar = true;
anyVar = {};
anyVar = () => {};
anyVar.toUpperCase();
anyVar.toFixed();

let num: number = 10;
num = anyVar; // 오류 발생하지 않음

let unknownVar: unknown;

unknownVar = "";
unknownVar = 1;
unknownVar = () => {};

// num = unknownVar; // 오류 발생
// unknownVar.toUpperCase(); 오류 발생

// 타입을 정제하였을 경우에는 unknown 값을 할당 가능
if(typeof unknownVar === "number"){
  num = unknownVar;
}