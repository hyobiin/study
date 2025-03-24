import { useRef, useState } from "react";
import './PagingPosts.css'

const PagingPosts = () => {

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [maxPageButtons, setmaxPageButtons] = useState(5);
  // id 값은 useRef로 받아온다, JS처럼 getElementById로 가져와도 되지만 리액트를 사용하기 때문에 리액트 기능 사용
  // 이유: 렌더링이 되지 않고 input에 연결된 파일 값을 가지고 있기 때문
  // useRef => 해당 값을 가지고 있는다 / form에서 submit 같은거 할 때 많이 사용
  const fileInputRef = useRef(null);


  const loadData = () => {
    const file = fileInputRef.current.files[0];

    if(!file){
      alert("파일이 없습니다.!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try{
        const data = JSON.parse(e.target.result);

        setPosts(data.posts);

        setCurrentPage(1);

      }catch(error){
        alert("파일 읽기 오류");
      }
    };

    reader.readAsText(file);
  };

  const totalPages = Math.ceil(posts.length / recordsPerPage);

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage - 1;
    const currentPosts = posts.slice(startIndex, endIndex + 1);
    console.log(currentPosts, posts)

    return currentPosts.map((post, index) => ( // 컴포넌트니까 ()로 감싸야 함**
      <tr key={post.post_id || index}>
        <td>{post.post_id}</td>
        <td>{post.title}</td>
        <td>{post.author}</td>
        <td>{post.created_at}</td>
        <td>{post.tags.join(", ")}</td>
      </tr>
    ));
  };

  const handlePageChange = (page) => {
    if(page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    if(totalPages === 0) return null;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons/ 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if(endPage - startPage + 1 < maxPageButtons){
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    const buttons = [];

    if(currentPage > 1){
      buttons.push(
        <button key="first" onClick={() => handlePageChange(1)}>{"<<"}</button>
      )
    }

    if(startPage > 1){
      buttons.push(
        <button key="prev" onClick={() => handlePageChange(currentPage - 1)}>{"<"}</button>
      )
    }

    for(let i = startPage; i <= endPage; i++){
      buttons.push(
        <button 
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? "current" : ""}
        >{i}</button>
      );
    }

    if(endPage < totalPages){
      buttons.push(
        <button key="next" onClick={() => handlePageChange(currentPage + 1)}>{">"}</button>
      );
    }

    if(currentPage < totalPages){
      buttons.push(
        <button key="last" onClick={() => handlePageChange(totalPages)}>{">>"}</button>
      );
    }

    return buttons;
  }

  return(
    <div className="container">
      <h1>게시글 페이징</h1>
      <input type="file" ref={fileInputRef} /> <br /><br />
      <label htmlFor="">
        페이지 당 레코드 수:{" "}
        <input
          type="number"
          min="1"
          value={recordsPerPage}
          onChange={(e) => setRecordsPerPage(parseInt(e.target.value) || 1)}
        />
      </label>
      {" "}
      <label>
        페이지 버튼 최대 수:{" "}
        <input
          type="number"
          min="1"
          value={maxPageButtons}
          onChange={(e) => setmaxPageButtons(parseInt(e.target.value) || 1)}
        />
      </label>
      <button onClick={loadData}>데이터 로드</button>
      <br /><br />
      <table>
        <thead>
          <tr>
            <th>게시글 ID</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성 시간</th>
            <th>태그</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      {" "}
      <div className="pagination">{renderPaginationButtons()}</div>
    </div>
  );
}

export default PagingPosts