import { useState } from "react";
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

    console.trace('여기서 호출');

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
                            <colgroup>
                                <col width="5%" />
                                <col width="25%" />
                                <col width="10%" />
                                <col width="25%" />
                                <col width="20%" />
                                <col width="10%" />
                                <col width="5%" />
                            </colgroup>
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
                                    {Object.values(data).map((value, valueIndex) => (
                                        <td key={`${dataIndex}-${valueIndex}`}>
                                            {Array.isArray(value) ? value.join(", ") :
                                            typeof value === "object" ?
                                            Object.entries(value).map(([key, val]) => `${key}: ${val}`).join(", ") :
                                            value}
                                        </td>
                                    ))}
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