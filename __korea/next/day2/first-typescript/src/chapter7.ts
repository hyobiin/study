// void 타입
// void => 공허 => 아무것도 없음을 의미하는 타입

function func1(): string {
  return "hello";
}

// 반환(return)하는 것이 없을 때 = 실행만을 위한 함수
function func2(): void {
  console.log("hi")
}

// return을 그냥 끝내줄 때 = undefined 반환
function func3(): undefined {
  console.log("hey");
  return; // void가 undefined를 포합하고 있기 때문에 생략해도 됨
}

// null 타입은 retrun null 필수, 없으면 에러
function func4(): null {
  console.log("hey");
  return null;
}


let a : void;
// 에러
// a = 1;
// a = "hello"
// a = {};

// 가능
a = undefined; //하위라서 가능
a = null; // tsconfing.json에서 오류 발생을 삭제했기 때문에 가능



// never
// never => 존재하지 않는 불가능한 타입
function func5(): never {
  while(true){}
}

function func6(): never {
  throw new Error();
}


let anyVar: any;
let b: never;
// 어떤 값도 할당 할 수 없음
// b = 1;
// b = {};
// b = "";
// b = null;
// b = undefined;
// b = any;
