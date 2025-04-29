import AddForms from "./components/form/AddForms"
import CustomChkSelect from "./components/form/CustomChkSelect"
import CustomDate from "./components/form/CustomDate"
import ChartList from "./pages/ChartList"
// import PagingPosts from "./PagingPosts_btn"


function App() {

  return (
    <>
      {/* <PagingPosts /> */}

      {/* <CustomChkSelect /> */}
      {/* <Form /> */}

      {/* <CustomDate /> */}



      {/* 동적 폼 추가 */}
      <AddForms />

      {'[차트]'}
      <ChartList />
    </>
  )
}

export default App