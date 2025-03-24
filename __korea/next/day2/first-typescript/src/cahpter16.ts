// 함수 타입 정의

// 함수를 설명하는 가장 좋은 방법
// 어떤 매개변수를 받고, 어떤 변환값을 반환하는지 X
// 어떤 [타입의] 매개변수를 받고, 어떤 [타입의] 변환값을 반환하는지 O
function func(a: number, b: number) : number{
  return a + b;
}

// 화살표 함수의 타입정의
const add = (a: number, b: number) : number => a + b;

// 함수의 매개변수
// function introduce(name: "홍길동", tall?: number, age: number){ 오류
function introduce(name: "홍길동", age: number, tall?: number){ // **필수적 매개변수는 선택적 매개변수 앞에 위치해야함 (타입스크립트 특징)
  console.log(`name: ${name}`);

  // 타입 좁히기
  if(typeof tall === "number"){
    console.log(`tall: ${tall + 10}`);
  }
}

// introduce(1); // 에러
introduce("홍길동", 27, 180);
introduce("홍길동", 27);

// function getSum(...rest: [number, number, number]){
function getSum(...rest: number[]){ // 여러개 올 수 있음
  let sum = 0;
  rest.forEach((it) => (sum += it));

  return sum;
}

getSum(1, 2, 3) // 6
getSum(1, 2, 3, 4, 5) // 15
