const tabName = [ "ess-ui", "metapay" ]

const tabTh = {
    default: [ "경로", "수정 파일", "상세", "URL", "특이 사항", "비고 (주석)", "요청자" ],
    metapay: [ "구분", "화면명", "상세", "URL", "수정 사항", "요청자"]
}

const tabData = {
    ui: [
        {
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
                "링크",
                "링크"
            ],
            notice: "수정 내역",
            annotation: [
                "1,2: 현재 기본 배너 (분기처리 되어 있던 부분 삭제), // 기본 배너, 제증명신청 배너 분기처리 삭제",
                "[hb] 250306 법인명으로 분기처리 되어 있던 부분 통합 처리"
            ],
            requestor: "250306 완료"
        },
    ],
    projectA:[
        {
            section: "푸터",
            method: {
                type: "link",
                text: "링크",
                image: "img/250307_wp_admin.PNG"
            },
            link: "링크",
            annotation: "수정내역",
            requestor: "250307 완료"
        },
    ]
}

export { tabName, tabData };