// enum 타입
// 여러가지 값들에 각각 이름을 부여해 열거해두고 사용하는 타입

// enum 의 기본 특징: 0 부터 시작해서 +1 씩 됨
// ex) USER = 10을 지정하면, ADMIN = 0, USER = 10, GUEST = 11 이 자동 부여됨
enum Role {
  ADMIN,
  USER,
  GUEST
}

// 문자형 enum
enum Language{
  korean = "ko",
  english = "en"
}

const user1 = {
  name: "홍길동",
  // role: 0 // 관리자라고 가정 // 협업시 헷갈릴 수 있기 때문에
  role: Role.ADMIN,
  language: Language.korean
}

const user2 = {
  name: "아무개",
  // role: 1 // 일반유저로 가정
  role: Role.USER,
  language: Language.english
}

const user3 = {
  name: "게스트",
  // role: 2 // 게스트로 가정
  role: Role.GUEST
}

console.log(user1, user2, user3)

// ** enum은 tsc 명령으로 js로 컴파일 해도 enum 타입은 사라지지 않고 js로 변환 됨