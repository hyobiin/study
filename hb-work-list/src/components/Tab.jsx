import React, { useState } from "react";
import { tabName, tabTh, tabData } from "../data/tabData";

export default function TabComponent(){
    // tab-list
    const [activeTab, setActiveTab] = useState(0) // 현재 선택된 탭의 index

    const handleTabClick = (index) => {
        setActiveTab(index);
    }

    // tab-con-list
    const tabDataKey = Object.keys(tabData);

    const tabThKey = Object.keys(tabTh);

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
            <div className="tab-con-list">
                {tabName.map((tab, index) => (
                    <div key={index}
                        className={`tab-con ${activeTab === index ? "active" : ""}`}
                    >
                        <table>
                            {/* TODO: colgroup도 분기해야함 */}
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
                                                    {/* NOTE
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