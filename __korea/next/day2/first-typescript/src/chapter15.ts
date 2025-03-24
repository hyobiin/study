// 서로소 유니온 타입
// 교집합이 없는 타입들로만 만든 유니온 타입

type Admin = {
  tag: "ADMIN";
  name: string;
  kickCount: number;
};

type Member = {
  tag: "MEMBER";
  name: string;
  point: number;
  kickCount: number;
};

type Guest = {
  tag: "GUEST";
  name: string;
  visitCount: number;
};

type User = Admin | Member | Guest;

function login(user: User){
  // 이런 식이면 겹치는 게 발생하기 때문에 하단처럼 tag를 써서 사용
  // if("kickCount" in user){
  //   console.log(`${user.name}님 현재까지 ${user.kickCount}명 강퇴했습니다.`);
  // }else if("point" in user){
  //   console.log(`${user.name}님 현재까지 ${user.point}포인트 모았습니다.`);
  // }else{
  //   console.log(`${user.name}님 현재까지 ${user.visitCount}번 방문했습니다.ㄴ`);
  // }

  // 서로소 유니온 타입 / tag 사용
  // if(user.tag === "ADMIN"){
  //   console.log(`${user.name}님 현재까지 ${user.kickCount}명 강퇴했습니다.`);
  // }else if(user.tag === "MEMBER"){
  //   console.log(`${user.name}님 현재까지 ${user.point}포인트 모았습니다.`);
  // }else{
  //   console.log(`${user.name}님 현재까지 ${user.visitCount}번 방문했습니다.ㄴ`);
  // }

  // 더 깔끔한 코드
  switch(user.tag){
    case "ADMIN": {
      console.log(`${user.name}님 현재까지 ${user.kickCount}명 강퇴했습니다.`);
      break;
    }
    case "MEMBER": {
      console.log(`${user.name}님 현재까지 ${user.point}포인트 모았습니다.`);
      break;
    }case "GUEST": {
      console.log(`${user.name}님 현재까지 ${user.visitCount}번 방문했습니다.ㄴ`);
      break;
    }
  }
}

// 권장하지 않음
// type AsyncTask = {
//   state: "LOADING" | "FAILED" | "SUCCESS";
//   error?: {
//     message: string;
//   };
//   response?: {
//     data: string;
//   };
// }

// 권장
type LoadingTask = {
  state: "LOADING";
};

type FailedTask = {
  state: "FAILED";
  error: {
    message: string;
  }
};

type SuccessTask = {
  state: "SUCCESS";
  response: {
    data: string;
  }
};

type AsyncTask = LoadingTask | FailedTask | SuccessTask;

function processResult(task: AsyncTask){
  switch(task.state){
    case 'LOADING':{
      console.log("로딩 중...");
      break;
    }
    case 'FAILED':{
      // console.log(`에러 발생: ${task.error!.message}`); // 권장하지 않음
      console.log(`에러 발생: ${task.error.message}`);
      // task // FailedTask라고 단언됨
      break;
    }
    case 'SUCCESS':{
      // console.log(`성공: ${task.response!.data}`); // 권장하지 않음
      console.log(`성공: ${task.response.data}`);
      break;
    }
  }
}

const loading: AsyncTask = {
  state: "LOADING"
}

const failed: AsyncTask = {
  state: "FAILED",
  error: {
    message: "오류발쉥"
  }
}

const success: AsyncTask = {
  state: "SUCCESS",
  response: {
    data: "데이터ㅓ어엉"
  }
}

processResult(loading);