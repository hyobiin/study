const tabName = [ "ess-ui", "metapay" ]

const tabTh = {
    default: [ "경로", "수정 파일", "상세", "URL", "특이 사항", "비고 (주석)", "요청자" ],
    metapay: [ "구분", "화면명", "상세", "URL", "수정 사항", "요청자"]
}

const tabData = {
    ui: [
        {
            section: "메인",
            modifyFiles: [
                {
                    type: "html",
                    files: [
                        "src>main>templates>content>main>main.html"
                    ]
                },
                {
                    type: "js",
                    files: [
                        "src>main>resources>static>js>biz>main>main.js"
                    ]
                },
                {
                    type: "css",
                    files: [
                        "src>main>resources>static>css>metaui.css",
                        "src>main>resources>static>css>metaui.min.css",
                        "src>main>resources>static>css>metaMui.css",
                        "src>main>resources>static>css>metaMui.min.css"
                    ]
                }
            ],
            image: "img/250306_main.PNG",
            link: [
                "https://handok.metapay-dev.co.kr/",
                "https://kmi.metapay-dev.co.kr/",
                "file:///C:/payrollIF/workspace/ess-html/01metapay/html/index.html"
            ],
            notice: "한독, ls, 가온과 나머지 법인들이 적용된 내용이 달라서 분기처리 삭제해야 했음",
            annotation: [
                "1,2: 현재 기본 배너 (분기처리 되어 있던 부분 삭제), // 기본 배너, 제증명신청 배너 분기처리 삭제",
                "[hb] 250306 법인명으로 분기처리 되어 있던 부분 통합 처리"
            ],
            requestor: "250306 완료 <br> 손성희 이사님"
        },
    ],
    metapay:[
        {
            section: "푸터",
            method: {
                type: "link",
                text: "https://metapay.co.kr/signin",
                image: "img/250307_wp_admin.PNG"
            },
            link: "https://metapay.co.kr/",
            annotation: "Bottom에 있는 대표전화 수정 02-2040-5366 -> 02-2040-5296",
            requestor: "250307 완료 <br> 손성희 이사님"
        },
    ]
}

export { tabName, tabTh, tabData };