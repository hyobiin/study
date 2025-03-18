import { useState } from "react";
import { tabName, tabData } from "../data/tabData";

export default function TabComponent(){
    // tab-list
    const [activeTab, setActiveTab] = useState(0) // 현재 선택된 탭의 index

    const handleTabClick = (index) => {
        setActiveTab(index);
    }

    // tab-con-list
    const tabDataKey = Object.keys(tabData);

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
                    <thead>
                        <tr>
                            {
                                activeTab === 0 ?
                                (<th>1</th>) :
                                (<th>2</th>)
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tabName.map((tab, index) => (
                                <tr key={index}
                                    className={`tab-con ${activeTab === index ? "active" : ""}`}
                                >
                                    {
                                        tabData[tabDataKey[index]].map((data, index) => (
                                            <td key={index}>{data.notice}</td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}