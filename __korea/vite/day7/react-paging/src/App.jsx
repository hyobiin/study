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

function App() {

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  return (
    <>
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
    </>
  )
}

export default App