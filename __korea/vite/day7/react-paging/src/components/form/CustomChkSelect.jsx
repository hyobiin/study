import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { cloneDeep } from "lodash";
import Checks from "./Checks"


const CustomChkSelect = () => {
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        { id: 1, name: '단축근로1', label: 'A가 길어진다면?' },
        { id: 2, name: '단축근로2', label: 'B' },
        { id: 3, name: '단축근로3', label: 'C' },
        { id: 4, name: '단축근로4', label: 'D' },
    ]

    const roleForm = useFormik({
        initialValues: {
            permissions: {
                basicRole: {
                    read: {
                        read : false
                    }
                }
            }
        }
    });

    const handleCheckChange = (e, optionId) => {
        let permissions = cloneDeep(roleForm.values.permissions);

        if (!permissions.basicRole) {
            permissions.basicRole = {}; // 기본값 설정
        }
        if (!permissions.basicRole.read) {
            permissions.basicRole.read = {}; // 기본값 설정
        }

        permissions.basicRole.read[`read${optionId}`] = e.target.checked;
        roleForm.setFieldValue('permissions', permissions);
    }

    // 외부 클릭 시 닫힘
    const selectRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if(selectRef.current && !selectRef.current.contains(event.target)){
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return() => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    return(
        <>
            <style>{`
                .custom-select-wrap{position:relative;}
                .custom-select-wrap .title-box{padding:5px 40px 5px 5px;border:1px solid #ccc;border-radius:10px;background:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23333' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e") no-repeat calc(100% - 13px) 50% / 12px;}
                .custom-select-wrap .title-box.active{border-color:rgb(184, 170.5, 246.5);box-shadow:inset 0 1px 2px rgba(0, 0, 0, 0.075), 0 0 0 0.25rem rgba(113, 86, 238, 0.25);}
                .custom-select-wrap .option-box{z-index:1;position:absolute;left:0;right:0;top:30px;padding:15px;border:1px solid #ccc;border-radius:10px;background:#fff;}
                .custom-select-wrap .option-box ul{margin:0;padding:0;list-style:none;}
            `}</style>

            <div className="custom-select-wrap" ref={selectRef}>
                <div
                    className={`title-box ${isOpen ? "active" : ""}`}
                    onClick={() => setIsOpen(prev => !prev)}
                >단축근로 종류를 선택하세요</div>
                {
                    isOpen && (
                        <div className="option-box">
                            <ul>
                                {
                                    options.map((option) => (
                                        <li>
                                            <Checks
                                                key={option.id}
                                                type='checkbox'
                                                label={option.label}
                                                checked={roleForm.values.permissions?.basicRole?.read[`read${option.id}`] || false}
                                                onChange={(e) => handleCheckChange(e, option.id)}
                                            ></Checks>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    )
                }
            </div>
        </>
    )

}

export default CustomChkSelect