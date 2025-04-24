import { useFormik } from "formik"
import Check from "./components/form/Check"
import CustomChkSelect from "./components/form/CustomChkSelect"
import Radio from "./components/form/Radio"
import Form from "./pages/form"
// import PagingPosts from "./PagingPosts_btn"


function App() {

  const formData = useFormik({
    initialValues: {
      check: false,
      check2: false,
      radio: false,
    }
  })

  return (
    <>
      {/* <PagingPosts /> */}
      <Form />
      <Check name="check" type="checkbox" label="체크해주세요"/>
      <Check name="check2" type="checkbox" label="체크해주세요12"/>
      <Radio name="radio" type="radio" label="라디오 버튼" />
      <Radio name="radio" type="radio" label="라디오 버튼2" />
      <CustomChkSelect />
    </>
  )
}

export default App
