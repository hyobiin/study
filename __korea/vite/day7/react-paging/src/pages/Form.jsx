import Input from "../components/form/Input";

export default function Form(){
    return(
        <>
            <Input placeholder="이름을 입력해주세요" /> <br />
            <Input type="number" min={0} />
        </>
    )
}