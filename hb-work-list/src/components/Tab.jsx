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
                <table>
                    <colgroup>
                        <col width="80px" />
                        <col />
                        <col width="200px" />
                        <col />
                        <col width="20%" />
                        <col width="300px" />
                        <col width="120px" />
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
                        {
                            tabName.map((tab, index) => (
                                <div key={index}
                                    className={`tab-con ${activeTab === index ? "active" : ""}`}
                                >
                                    <tr>
                                        {
                                            tabData[tabDataKey[index]].map((data, dataIndex) => (
                                                Object.values(data).map((value, valueIndex) => (
                                                    <td key={`${dataIndex}-${valueIndex}`}>
                                                        {Array.isArray(value) ? value.join(", ") :
                                                        typeof value === "object" ?
                                                        Object.entries(value).map(([key, val]) => `${key}: ${val}`).join(", ") :
                                                        value}
                                                    </td>
                                                ))
                                            ))
                                        }
                                    </tr>
                                </div>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

// test