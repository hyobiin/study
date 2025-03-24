// 타입 추론
// 마우스 커서를 통해 타입 추론이 어떻게 되었는지 확인

let a = 10;
let b = "hello";

let c = {
  id: 1,
  name: "홍길동",
  profile: {
    nickname: "hihihi",
  },
  urls: ["naver.com"]
}

let { id, name, profile } = c;
let [one, two, three] = [1, "hello", true];

// any타입으로 추론 됨
let d;

d = 10;
// number 타입으로 추론 됨
// any 타입의 진화
d.toFixed();

d = "hello";

// string 타입으로 추론
d.toUpperCase();
// d.toFixed(); // string으로 바꼈기 때문에 number 속성 사용 불가


// const는 리터럴로 추론 => number로 나오지 않고 num: 10 이 표시됨
const num = 10;
const str = "hello";