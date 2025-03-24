// 객체 타입
/*
let user: object = {
  id: 1,
  name: "홍길동"
};

// 호출 불가
// 에러 발생 이유: 이 값이 객체라는 것 말고 제공되는게 없기 때문
user.id;
*/
// 객체 리터럴 타입
// 구조적 타입 시스템
let user = {
    id: 1,
    name: "홍길동"
};
user.id;
// id에 옵셔널(?)을 주면 id를 주지 않아도 에러가 나지 않는다.
user = {
    name: "김길동"
};
user.name = "문길동";
// 값이 변하면 안 될 때 => readonly 사용
let config = {
    apiKey: "alfiowjflkaej key"
};
export {};
// config.apiKey = "바꿈"; // 에러
