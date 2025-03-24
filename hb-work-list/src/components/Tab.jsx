import React, { useState, useRef } from "react";
import { tabName, tabTh, tabData } from "../data/tabData";

export default function TabComponent(){
    ///// s ============ 탭 ============
    // tab-list
    const [activeTab, setActiveTab] = useState(0) // 현재 선택된 탭의 index

    const handleTabClick = (index) => {
        setActiveTab(index);
    }

    // tab-con-list
    const tabDataKey = Object.keys(tabData);

    const tabThKey = Object.keys(tabTh);
    ///// e ============ 탭 ============

    ///// s ============ 검색 ============
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredResult, setFilteredResult] = useState("");
    const searchInpRef = useRef(null);

    // 검색 버튼 클릭시 검색어를 가져와서 검색
    const handleSearch = () => {
        const keyword = searchInpRef.current.value.toLowerCase();

        if (!searchInpRef.current || keyword.trim() === "") return;

        setSearchTerm(keyword);
        const filteredData = extractedValues[activeTab].map(tab =>{
            const filteredTab = tab.filter(data =>
                JSON.stringify(data).toLowerCase().includes(keyword)
            );
            return filteredTab.length > 0 ? filteredTab : null; // 빈배열은 나오지 않게
        }).filter(tab => tab !== null); // null 값은 제외하고 필터링

        // 검색 결과가 있는 데이터 배열만 필터링
        const result =  extractedValues[activeTab].filter(data => data.some(value => value.includes(keyword)));

        setFilteredResult(result); // 전역변수로 사용할 수 있게 대입

        console.log("------------s: 버튼 클릭------------");
        console.log(searchInpRef.current.value);
        console.log(filteredData);
        console.log(result);
        console.log("------------e: 버튼 클릭------------");
    }

    const extractedValues = Object.values(tabData).map(data =>
        data.map(value => Object.values(value))
    )

    console.log("------------s: 기본 출력------------");
    console.log(`extractedValues[activeTab]: ${extractedValues[activeTab]}`);
    console.log(`JSON.stringify.(extractedValues[activeTab]): ${JSON.stringify(extractedValues[activeTab])}`); // 객체나 배열을 JSON 문자열로 변환
    console.log(`extractedValues[activeTab].length: ${extractedValues[activeTab].length}`);
    console.log("setFilteredResult:", setFilteredResult);
    console.log("filteredResult.length:", filteredResult.length);
    console.log("------------e: 기본 출력------------");
    ///// e ============ 검색 ============

    return(
        <>
            <ul className="tab-list">
                {
                    tabName.map((tab, index) => (
                        <li key={index}
                            className={activeTab === index ? "active" : ""}
                        ><button onClick={() => handleTabClick(index)}>{tab}</button>
                        </li>
                    ))
                }
            </ul>
            <div className="search-box">
                <input type="text" placeholder="검색어를 입력하세요" ref={searchInpRef}/>
                <button className="btn-search" onClick={handleSearch}>검색</button>
            </div>

            {/* TODO_HB 검색 로직
                [o] 1. 데이터를 배열로 가져오기 (검색 로직에 사용하기 위함)
                [o] 1-1. 해당 탭 데이터만 배열로 가져오기
                [o] 2. 버튼을 눌렀을 때 input value 값을 가져와서 있는지 없는지 비교
                [o] 2-1. 값이 있으면 그 값이 있는 index를 찾아서 console로 출력
                [] 2-2. 해당 index 값만 필터링하여 화면에 출력
                [] 2-3. 검색 결과가 없을 경우 "검색 결과가 없습니다." 출력
            */}
            <ul>
                {filteredResult.length > 0
                    ? (
                        filteredResult.map((data, index) => (
                            <li key={index}>
                                <React.Fragment>{JSON.stringify(data)}</React.Fragment>
                            </li>
                        ))
                    ) : (
                        <li>검색 결과가 없습니다.</li>
                    )
                }
            </ul>


            <div className="tab-con-list">
                {tabName.map((tab, index) => (
                    <div key={index}
                        className={`tab-con ${activeTab === index ? "active" : ""}`}
                    >
                        <table>
                            { activeTab == tabName.length - 1
                            ?   <colgroup>
                                    <col width="5%" />
                                    <col width="25%" />
                                    <col width="15%" />
                                    <col width="25%" />
                                    <col width="20%" />
                                    <col width="10%" />
                                </colgroup>
                            :   <colgroup>
                                    <col width="5%" />
                                    <col width="25%" />
                                    <col width="10%" />
                                    <col width="25%" />
                                    <col width="20%" />
                                    <col width="10%" />
                                    <col width="5%" />
                                </colgroup>
                            }
                            <thead>
                                <tr>
                                    {activeTab == tabName.length - 1
                                        ? tabTh[tabThKey[1]].map((th, index) => (
                                            <th key={index}>{th}</th>
                                        ))
                                        : tabTh[tabThKey[0]].map((th, index)=> (
                                            <th key={index}>{th}</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {tabData[tabDataKey[index]].map((data, dataIndex) => (
                                    <tr key={dataIndex}>
                                        {
                                            activeTab == tabName.length - 1 ?
                                            (
                                                <>
                                                <td>{data.section}</td>
                                                <td>
                                                    {data.method?.map((method, index) => (
                                                        <div key={index}>
                                                            <strong>[ {method.type} ]</strong><br/>
                                                            {Array.isArray(method.files)
                                                                ? method.files.map((file, index) => (
                                                                    <React.Fragment key={index}>
                                                                        {file} <br/>
                                                                    </React.Fragment>
                                                                ))
                                                                : method.files
                                                            }
                                                            <br/><br/>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td><a href={data.link}>{data.link}</a></td>
                                                <td>{data.link}</td>
                                                <td>{data.annotation}</td>
                                                <td>{data.requestor}</td>
                                                </>
                                            ):(
                                                <>
                                                <td>{data.section}</td>
                                                <td>
                                                    {data.modifyFiles?.map((fileData, index) => (
                                                        <div key={index}>
                                                            <strong>[ {fileData.type} ]</strong><br/>
                                                            {fileData.files.join("<br/>")}
                                                            <br/><br/>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td><a href={data.image}></a></td>
                                                <td>
                                                    {(typeof data.link === "string" // 문자열인지 구분하여 true면 배열로 반환
                                                        ? [data.link]
                                                        : Array.isArray(data.link) // 배열인지 구분하여 true면 그대로 반환
                                                        ? data.link
                                                        : Object.values(data.link) // 문자열과 배열이 아니면(객체라고 간주) 값을 배열로 변환
                                                    ).map((link, index) => (
                                                        <a key={index} href={link}>{link}</a>
                                                    ))}
                                                    {/* NOTE_HB
                                                        Array.isArray( data ) => data가 배열(array)인지 확인
                                                        Object.values( data ) => data(객체)의 값을 배열로 반환
                                                        Object.keys( data ) => data(객체)의 key값을 배열로 반환
                                                        Object.entries( data ) => data(객체)의 키-값 쌍 -> key, value를 배열로 반환
                                                        Object.fromEntries( data ) => data(배열)를 객체로 변환
                                                    */}
                                                </td>
                                                <td>{data.notice}</td>
                                                <td>
                                                    {(typeof data.annotation == "string"
                                                        ? [data.annotation]
                                                        : Array.isArray(data.annotation)
                                                        ? data.annotation
                                                        : Object.values(data.annotation)
                                                    ).map((annotation, index) => (
                                                        <div key={index}>{annotation}</div>
                                                    ))}
                                                </td>
                                                <td>{data.requestor}</td>
                                                </>
                                            )
                                        }
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </>
    )
}