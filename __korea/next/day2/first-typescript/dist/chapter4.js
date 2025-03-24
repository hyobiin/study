// 타입 별칭
// 같은 타입이 중복되면 에러 발생
// type User = {};
// 함수 스코프 단위에서의 타입 중복은 에러 발생하지 않음
function func() {
}
let user = {
    id: 1,
    name: "홍길동",
    nickname: "gildong",
    birth: "1997.01.31",
    bio: "안녕하세요",
    location: "부천시"
};
let user2 = {
    id: 2,
    name: "김길동",
    nickname: "kim_gildong",
    birth: "2000.01.31",
    bio: "안녕하세요~~~",
    location: "수원시"
};
let countryCodes = {
    Korea: "ko",
    UnitedState: "us",
    UnitedKingdom: "uk"
};
// let countryNumberCodes: CountryNumberCodes = {
//   Korea: 410,
//   UnitedState: 840,
//   UnitedKingdom: 826
// };
// let countryNumberCodes: CountryNumberCodes = {} // 에러
let countryNumberCodes = {
    Korea: 0
};
export {};
// tsc 명령으로 **js로 컴파일 하면 타입 속성은 js파일에서 사라짐
