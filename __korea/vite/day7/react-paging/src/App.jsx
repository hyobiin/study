import AddForms from "./components/form/AddForms"
import CustomChkSelect from "./components/form/CustomChkSelect"
import CustomDate from "./components/form/CustomDate"
import Login from "./components/login/Login"
import Table from "./components/table/Table"
import ChartList from "./pages/ChartList"
// import PagingPosts from "./PagingPosts_btn"
import { useState } from "react"


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
    </>
  )
}

export default App