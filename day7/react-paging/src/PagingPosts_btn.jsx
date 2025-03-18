import React, { useState, useRef } from 'react';
import './PagingPosts.css';

const PagingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [maxPageButtons, setMaxPageButtons] = useState(5);

  const fileInputRef = useRef(null);

  // 버튼을 누르면 파일을 가져오기 위한 useState
  const [tempRecordsPerPage, setTempRecordsPerPage] = useState(5);
  const [tempMaxPageButtons, setTempMaxPageButtons] = useState(5);

  const loadData = () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert('파일을 선택해주세요!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setPosts(data.posts);
        setCurrentPage(1);

        // 버튼 누르면 페이지와 버튼을 변경
        setRecordsPerPage(tempRecordsPerPage);
        setMaxPageButtons(tempMaxPageButtons);

      } catch (error) {
        alert('파일 읽기 오류');
      }
    };
    reader.readAsText(file);
  };

  const totalPages = Math.ceil(posts.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const currentPosts = posts.slice(startIndex, startIndex + recordsPerPage);
    return currentPosts.map((post, index) => (
      <tr key={post.post_id || index}>
        <td>{post.post_id}</td>
        <td>{post.title}</td>
        <td>{post.author}</td>
        <td>{post.created_at}</td>
        <td>{post.tags.join(', ')}</td>
      </tr>
    ));
  };

  const renderPaginationButtons = () => {
    if (totalPages === 0) return null;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    const buttons = [];

    if (currentPage > 1) {
      buttons.push(
        <button key="first" onClick={() => handlePageChange(1)}>
          {"<<"}
        </button>
      );
    }
    if (startPage > 1) {
      buttons.push(
        <button key="prev" onClick={() => handlePageChange(startPage - 1)}>
          {"<"}
        </button>
      );
    }
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? "current" : ""}
        >
          {i}
        </button>
      );
    }
    if (endPage < totalPages) {
      buttons.push(
        <button key="next" onClick={() => handlePageChange(endPage + 1)}>
          {">"}
        </button>
      );
    }
    if (currentPage < totalPages) {
      buttons.push(
        <button key="last" onClick={() => handlePageChange(totalPages)}>
          {">>"}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="container">
      <h1>게시글 페이징</h1>
      <input type="file" ref={fileInputRef} />
      <br /><br />
      <label>
        페이지당 레코드 수:{" "}
        <input
          type="number"
          min="1"
          value={tempRecordsPerPage}
          onChange={(e) => setTempRecordsPerPage(parseInt(e.target.value) || 1)}
        />
      </label>
      {"  "}
      <label>
        페이지 버튼 최대 수:{" "}
        <input
          type="number"
          min="1"
          value={tempMaxPageButtons}
          onChange={(e) => setTempMaxPageButtons(parseInt(e.target.value) || 1)}
        />
      </label>
      {"  "}
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
      <div className="pagination">{renderPaginationButtons()}</div>
    </div>
  );
};

export default PagingPosts;
