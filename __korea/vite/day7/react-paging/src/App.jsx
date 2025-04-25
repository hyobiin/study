import { FieldArray, useFormik } from "formik"
import Check from "./components/form/Check"
import CustomChkSelect from "./components/form/CustomChkSelect"
import Radio from "./components/form/Radio"
import Form from "./pages/form"
import CustomDate from "./components/form/CustomDate"
// import PagingPosts from "./PagingPosts_btn"


function App() {

  const formData = useFormik({
    initialValues: {
      addForms: [
        {
          check: false,
          check2: false,
          radio: "false",
        }
      ]
    }
  })

  return (
    <>
      {/* <PagingPosts /> */}

      {/* 동적 추가 테스트 */}
      <FieldArray name="addForms">
        {({ push, remove}) => (
          <>
            {formData.values.addForms.map((item, index) => (
              <div key={index}>
                <Check name={`addForms[${index}].check`} type="checkbox" label="체크해주세요" checked={item.check} onChange={formData.handleChange} />
                <Check name={`addForms[${index}].check2`} type="checkbox" label="체크해주세요12" checked={item.check2} onChange={formData.handleChange} />
                <Radio name={`addForms[${index}].radio`} type="radio" label="라디오 버튼" value="true" checked={item.radio === 'true'} onChange={formData.handleChange} />
                <Radio name={`addForms[${index}].radio`} type="radio" label="라디오 버튼2" value="false" checked={item.radio === 'false'} onChange={formData.handleChange} />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                push({ check: false, check2: false, radio: "false"})
              }
            >클릭 시 폼 추가
            </button>
          </>
        )}
      </FieldArray>
      {/* 동적 추가 테스트 */}

      <pre>{JSON.stringify(formData.values, null, 2)}</pre>

      <CustomChkSelect />
      <Form />

      <CustomDate />
    </>
  )
}

export default App
