const tabName = [ "ui", "homepage" ]

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
                        "src>main.html"
                    ]
                },
                {
                    type: "js",
                    files: [
                        "src>main.js"
                    ]
                },
                {
                    type: "css",
                    files: [
                        "src>ui.css",
                        "src>ui.min.css",
                    ]
                }
            ],
            image: "img/250306_main.PNG",
            link: [
                "https://www.naver.com",
                "html/index.html"
            ],
            notice: "분기처리 삭제해야 했음",
            annotation: [
                "분기처리 삭제",
                "[hb] 250306 법인명으로 분기처리 되어 있던 부분 통합 처리"
            ],
            requestor: "250306 완료"
        },
        {
            section: "메인222",
            modifyFiles: [
                {
                    type: "html",
                    files: [
                        "src>main.html"
                    ]
                },
                {
                    type: "js",
                    files: [
                        "src>main.js"
                    ]
                },
            ],
            image: "img/250306_main.PNG",
            link: [
                "https://www.tistory.com/"
            ],
            notice: "분기처리 삭제해야 했음",
            annotation: [
                "확인"
            ],
            requestor: "250306"
        },
    ],
    homepage:[
        {
            section: "메인",
            method:[
                {
                    type: "html",
                    files: [
                        "src>main.html",
                        "src>main.html2"
                    ]
                }
            ],
            image: "img/250307_wp_admin.PNG",
            link: "www.naver.com",
            annotation: "Bottom에 있는 대표전화 수정",
            requestor: "완료날짜"
        },
    ]
}

export { tabName, tabTh, tabData };