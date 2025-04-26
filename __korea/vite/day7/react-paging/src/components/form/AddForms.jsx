import React from "react";
import { useFormik, Form, FormikProvider, FieldArray } from "formik";
import Check from "./Check";
import Radio from "./Radio";

const AddForms = () => {

    const formData = useFormik({
        initialValues: {
            addForms: [
                { check: true, check2: false, radio: "false" }
            ]
        },
        onSubmit: (values) => {
            console.log('제출 값', values);
        }
    });

    return(
        <FormikProvider value={formData}>
            <Form onSubmit={formData.handleSubmit}>
            <FieldArray name="addForms">
                {({ push, remove}) => (
                <>
                    {formData.values.addForms.map((item, index) => (
                    <div key={index}>
                        <Check name={`addForms[${index}].check`} type="checkbox" label="체크해주세요" checked={item.check} onChange={formData.handleChange} />
                        <Check name={`addForms[${index}].check2`} type="checkbox" label="체크해주세요12" checked={item.check2} onChange={formData.handleChange} />
                        <Radio name={`addForms[${index}].radio`} type="radio" label="라디오 버튼" value={"true"} checked={item.radio === 'true'} onChange={() => formData.setFieldValue(`addForms[${index}].radio`, 'true')} />
                        <Radio name={`addForms[${index}].radio`} type="radio" label="라디오 버튼2" value={"false"} checked={item.radio === 'false'} onChange={() => formData.setFieldValue(`addForms[${index}].radio`, 'false')} />
                    </div>
                    ))}
                    <button
                    type="button"
                    onClick={() =>
                        push({ check: false, check2: false, radio: "false"})
                    }
                    >폼 추가
                    </button>
                    <button
                    type="button"
                    onClick={() =>
                        remove({ check: false, check2: false, radio: "false"})
                    }
                    >폼 삭제
                    </button>
                    <button
                    type="button"
                    onClick={() =>
                        console.log("test")
                    }
                    >폼 데이터에 제출
                    </button>

                    <hr />
                    추가되는 값 보기 <br />
                    <pre>{JSON.stringify(formData.values, null, 2)}</pre>
                </>
                )}
            </FieldArray>
            </Form>
        </FormikProvider>
    )
}

export default AddForms;