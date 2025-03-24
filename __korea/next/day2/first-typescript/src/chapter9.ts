// 업 캐스팅 & 다운 캐스팅

// unknown 타입 (최상위 집합)

// 업 캐스팅으로 모두 가능
let a: unknown = 1;
let b: unknown = "hello";
let c: unknown = true;
let d: unknown = null;
let e: unknown = undefined;

let unknownVar: unknown;

// 다운 캐스팅 불가능
// let num: number = unknownVar;
// let num: string = unknownVar;
// let num: boolean = unknownVar;

function neverExam(){
  function neverFunc(): never {
    while(true){}
  }

  let num: number = neverFunc();
  let str: string = neverFunc();
  let bool: boolean = neverFunc();

  // 불가
  // let never1: never = 10;
  // let never2: never = "string";
  // let never3: never = true;

  // void
  function voidExam(){
    function voidFunc(): void{
      console.log('void');
    }

    let voidVar: void = undefined;
  }
}

// any
function anyExam(){
  let unknownVar : unknown;
  let anyVar: any;
  let undefinedVar: undefined;
  let neverVar: never;

  // 다운캐스팅 가능 (never 타입 빼고)
  // any 타입은 다운캐스팅 업캐스팅 모두 가능한 치트키 타입이기 때문
  anyVar = unknownVar;
  undefinedVar = anyVar;

  // never 타입은 any타입도 다운캐스팅을 할 수 없음
  // neverVar = anyVar;
}
