// 기본 타입간 호환성
let num1: number = 10;
let num2: 10 = 10;

num1 = num2;

// 상위 (더 적게 가지고 있는게 상위)
type Animal = {
  name: string;
  color: string;
};

// 하위
type Dog = {
  name: string;
  color: string;
  breed: string;
};

let animal: Animal = {
  name: "기린",
  color: "yellow"
}

let dog: Dog = {
  name: "돌돌이",
  color: "brown",
  breed: "진도"
}

animal = dog;
// 다운캐스팅이기 때문에 불가
// breed라고 하는 요소를 animal이 갖고 있지 않기 때문
// dog = animal;


type Book = {
  name: string;
  price: number;
};

type ProgrammingBook = {
  name: string;
  price: number;
  skill: string;
}

let book: Book;
let programmingBook: ProgrammingBook = {
  name: "리액트 기초",
  price: 24000,
  skill: "리액트"
}

// 초과 프로퍼티 검사를 회피할 수 있음
book = programmingBook;
// programmingBook = book;

// 초과 프로퍼티 검사가 발동해서 에러가 발생
// let book2: Book = {
//   name: "리액트 기초",
//   price: 24000,
//   skill: "reactjs" // Book에 없는 객체이기 때문에 에러
// };

function func(book: Book){}

func(book);
// 초과 프로퍼티 검사를 회피 (하위 집합을 넣었기 때문)
func(programmingBook);

// 초과 프로퍼티 검사 발생하여 에러
// func({
//   name: "리액트 기초",
//   price: 24000,
//   skill: "reactjs" // Book에 없는 객체이기 때문에 에러
// });