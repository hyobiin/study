// 타입 별칭

type User = {
  id: number;
  name: string;
  nickname: string;
  birth: string;
  bio: string;
  location: string;
};

// 같은 타입이 중복되면 에러 발생
// type User = {};

// 함수 스코프 단위에서의 타입 중복은 에러 발생하지 않음
function func(){
  type User = {};
}

let user: User = {
  id: 1,
  name: "홍길동",
  nickname: "gildong",
  birth: "1997.01.31",
  bio: "안녕하세요",
  location: "부천시"
};

let user2: User = {
  id: 2,
  name: "김길동",
  nickname: "kim_gildong",
  birth: "2000.01.31",
  bio: "안녕하세요~~~",
  location: "수원시"
}

// 인덱스 시그니처
type CountryCodes = {
  Korea: string,
  UnitedState: string,
  UnitedKingdom: string,
};

let countryCodes: CountryCodes = {
  Korea: "ko",
  UnitedState: "us",
  UnitedKingdom: "uk"
}

// 값이 키-값 쌍이 이후에 추가될 때
type CountryNumberCodes = {
  [key: string]: number;

  // 필수 속성 => 무조건 있어야 하는 값 (없으면 에러)
  // 인덱스 시그니처와 명시적으로 지정한 필수 속성의 타입을 일치 시켜야 함
  Korea: number;
}

// let countryNumberCodes: CountryNumberCodes = {
//   Korea: 410,
//   UnitedState: 840,
//   UnitedKingdom: 826
// };

// let countryNumberCodes: CountryNumberCodes = {} // 에러

let countryNumberCodes: CountryNumberCodes = {
  Korea: 0
}

// tsc 명령으로 **js로 컴파일 하면 타입 속성은 js파일에서 사라짐