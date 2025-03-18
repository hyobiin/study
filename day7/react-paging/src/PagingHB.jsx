import { useState, useEffect } from "react";
import './PagingPosts.css';

export default function Paging(){
    const [posts, setPosts] = useState([]); // 게시글 데이터
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [recordsPerPage, setRecordsPerPage] = useState(5); // 페이지 당 레코드 수
    const [maxPageButtons, setMaxPageButtons] = useState(5); // 페이지 버튼 최대 수

    // 파일 업로드 시 데이터 로드
    const loadData = (event) => {
        const file = event.target.files[0]; // 업로드된 파일 가져오기

        if(!file){
            alert("파일이 없습니다!");
            return;
        }

        const reader = new FileReader(); // 파일 읽기 객체 생성

        reader.onload = (e) => {
            try{
                const data = JSON.parse(e.target.result); // JSON 데이터로 변환
                const postsArray = Array.isArray(data) ? data : data.posts; // 무조건 배열로 변환 (오류 방지)
                setPosts(postsArray); // 게시글 데이터 설정
                setCurrentPage(1); // 현재 페이지 초기화
            }catch(error){
                alert("파일 읽기 오류");
            }
        };

        reader.readAsText(file); // 파일 텍스트로 읽기
    };

    // useEffect(() => {
    //     const recordsInput = document.getElementById("recordsPerPage");
    //     const maxButtonsInput = document.getElementById("maxPageButtons");

    //     if(recordsInput){
    //         recordsInput.value = recordsPerPage;
    //     }

    //     if(maxButtonsInput){
    //         maxButtonsInput.value = maxPageButtons;
    //     }

    //     console.log(recordsPerPage, maxPageButtons)
    // }, [recordsPerPage, maxPageButtons]);

    const handleRecordsPerPage = (e) => {
        setRecordsPerPage(Number(e.target.value));
    }

    const handleMaxPageButtonsChange = (e) => {
        setMaxPageButtons(Number(e.target.value));
    }

    // 상태가 변경될 때마다 posts 확인
    useEffect(() => {
        console.log("업데이트된 posts:", posts);
    }, [posts]);

    // 페이지에 맞는 데이터 반환
    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * recordsPerPage; // 시작 인덱스
        const endIndex = startIndex + recordsPerPage; // 끝 인덱스
        return posts.slice(startIndex, endIndex); // 페이지에 맞는 데이터 반환
    }

    // 동적 페이징
    const indexOfLastPage = currentPage * recordsPerPage; // 마지막 페이지 인덱스
    const indexOfFirstPage = indexOfLastPage - recordsPerPage; // 첫 페이지 인덱스
    const currentPosts = getPaginatedData(); // 현재 페이지 데이터

    const totalPages = Math.ceil(posts.length / recordsPerPage); // 전체 페이지 수

    return(
        <div className="wrap">
            <h1>페이징</h1>
            <input
                type="file"
                id="fileInput"
            />
            페이지 당 레코드 수:
            <input
                type="number"
                id="recordsPerPage"
                min="1"
                defaultValue="5"
                onChange={handleRecordsPerPage}

            />
            페이지 버튼 최대 수:
            <input
                type="number"
                id="maxPageButtons"
                min="1"
                defaultValue="5"
                onChange={handleMaxPageButtonsChange}
            />
            <button
                onClick={(e) => {
                    setMaxPageButtons(Number(e.target.value));
                    const fileInput = document.getElementById("fileInput");
                    if(fileInput.files.length > 0){
                        loadData({target:fileInput});
                    }else{
                        alert('파일을 선택하세요!');
                    }
                }}
            >데이터 로드</button>

            <table id="postsTable">
                <thead>
                    <tr>
                    <th>게시글 ID</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성 시간</th>
                    <th>태그</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentPosts.length > 0 ?(
                            currentPosts.map((post, index) => (
                            <tr key={index}>
                                <td>{post.post_id}</td>
                                <td>{post.title}</td>
                                <td>{post.author}</td>
                                <td>{post.created_at}</td>
                                <td>{post.tags ? post.tags.join(", ") : ""}</td>
                            </tr>
                        ))) : (
                            <tr className="no-data">
                                <td colSpan="5">데이터가 없습니다.</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>

            <div id="pagination" className="pagination">
                {
                    Array.from({length: totalPages}, (_, index) => (
                        <button
                            key={index + 1}
                            className={currentPage === index + 1 ? "current" : ""}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}