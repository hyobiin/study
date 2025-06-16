import './index.css';
import AddForms from "./components/form/AddForms"
import CustomChkSelect from "./components/form/CustomChkSelect"
import CustomDate from "./components/form/CustomDate"
import Login from "./components/login/Login"
import Table from "./components/table/Table"
import ChartList from "./pages/ChartList"
// import PagingPosts from "./PagingPosts_btn"
import { useState } from "react"
import Form from "./pages/tictactoe/State"
import Test from "./pages/tictactoe/StateInp"
import StateChoose from "./pages/tictactoe/StateChoose"
import Clock from "./pages/tictactoe/Clock"
import StateList from "./pages/tictactoe/StatelList"
import MailClient from "./pages/tictactoe/StateSeveral"
import SyncedInputs from "./pages/tictactoe/StateFilter"
import FilterableList from "./pages/tictactoe/StateSearch"
import ContactManager from "./pages/tictactoe/StateReset"
import Tictactoe from "./pages/tictactoe/game/Tictactoe"
import Gallery from "./pages/tictactoe/reference/Onclick"
import Async from "./pages/tictactoe/reference/Async"
import TodoList from "./pages/tictactoe/reference/TodoList"
import Counter from "./pages/tictactoe/reference/useReducer"
import FilterExample from "./pages/tictactoe/reference/UseReducer2"
import TodoListDnd from './pages/tictactoe/reference/TodoListDnd';
import FilterEx from './pages/tictactoe/reference/FilterEx';
import { StateEx, ReducerEx, ImmerEx } from './pages/tictactoe/reference/StateEx';
import { EffectEx, CallbackEx, MemoEx } from './pages/tictactoe/reference/EffectEx';
import { RefEx } from './pages/tictactoe/reference/RefEx';
import { UseContextEx } from './pages/tictactoe/reference/UseContextEx';
import GsapEx from './pages/pub/Gsap';
import PinnedEx from './pages/pub/GsapPin';

function App() {

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [modal, setModal] = useState(false);

  return (
    <>
      <button onClick={() => setModal(!modal)}>모달 띄우기</button>
      {modal && (
        <div style={{ background: '#eee' }}>
          <p>모달이 띄워집니다</p>
        </div>
      )}
      {/* <PagingPosts /> */}

      {/* <CustomChkSelect /> */}
      {/* <Form /> */}

      {/* <CustomDate /> */}



      {/* 동적 폼 추가 */}
      <AddForms />

      {/* 로그인 */}
      <Login />

      {/* {'[차트]'} */}
      {/* <ChartList /> */}

      {/* <Table selectedRowIndex={selectedRowIndex} setSelectedRowIndex={setSelectedRowIndex}/> */}

      {/* 틱택토 */}
      <Form />
      <Test />
      <StateChoose />

      <Clock time="오전 11시 30분" />

      <StateList />
      <MailClient />

      <SyncedInputs />
      <hr /><br />
      <FilterableList />

      <ContactManager />
      <Tictactoe />
      <Gallery />

      <Async />

      <hr />
      <hr />
      <div style={{ marginTop: '10px', padding:'20px', border: '2px solid #ccc', borderRadius: '8px', 'background': '#ffefef' }}>
        <TodoList />
      </div>
      <hr/>
      <TodoListDnd />
      <hr />
      <Counter />
      <FilterExample />

      <hr />
      <span style={{ fontWeight: 'bold' }}>필터</span>
      <hr />
      <FilterEx />
      <StateEx />
      <ReducerEx />
      <ImmerEx />

      <EffectEx />
      <CallbackEx />
      <MemoEx />

      {/* <RefEx />
      <RefCount /> */}

      <span>useContextEx</span>
      <UseContextEx />

      <GsapEx />
      <div style={{height:300}}></div>
      <div>
        <div style={{ height: "100vh" }}>
          <h2 style={{ textAlign: "center", marginTop: "50vh" }}>
            ⬇️ 아래로 스크롤 해보세요
          </h2>
        </div>
        <PinnedEx />
        <div style={{ height: "100vh", background: "#ddd" }}>
          <h2 style={{ textAlign: "center", marginTop: "50vh" }}>다음 섹션</h2>
        </div>
      </div>
    </>
  )
}

export default App