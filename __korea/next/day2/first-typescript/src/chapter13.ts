// 타입 단언
type Person = {
  name: string,
  age: number
};

// 빈 배열 넣기 (DB에서 값을 뭘 가져올지 모를 때)
let person = {} as Person;
person.name = "홍길동";
person.age = 7;
// person.language = "??"; // 에러


type Dog = {
  name: string,
  color: string
};

// 타입 단언을 통해 초과 프로퍼티 검사를 피할 수 있음
// DB에서 넘치게 데이터를 줬을 때, Dog에 있는 키값들만 가져와라
let dog: Dog = {
  name: "돌돌이",
  color: "brown",
  breed: "진도"
} as Dog;

// 타입 단언 규칙
// 값 as 단언
// A as B
// A가 B의 슈퍼 타입
// A가 B의 서브 타입

let num1 = 10 as never;
let num2 = 10 as unknown;

// 교집합이 없는 타입은 오류가 발생
// let num3 = 10 as string;
let num3 = 10 as unknown as string;

// const 단언
let num4 = 10 as const;

// const 단언으로 프로퍼티 값을 readonly로 변경
let cat = {
  name: "아옹",
  color: "yellow"
} as const;

type Post = {
  title: string,
  author?: string
};

let post: Post = {
  title: "게시글1",
  author: "홍길동"
};

// number 타입을 지정했을 때 옵셔널 체이닝을 사용하면 에러가 발생
// Not Null 단언 !를 사용해서 null이 아닌 것을 단언해 줄 수 있음
const len: number = post.author!.length;