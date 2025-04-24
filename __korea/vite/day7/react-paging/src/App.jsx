import Checks from "./components/form/Checks"
import CustomChkSelect from "./components/form/CustomChkSelect"
import Form from "./pages/form"
// import PagingPosts from "./PagingPosts_btn"


function App() {

  return (
    <>
      {/* <PagingPosts /> */}
      <Form />
      <Checks name="test" type="checkbox" label={"체크해주세요"}/>
      <CustomChkSelect />
    </>
  )
}

export default App
