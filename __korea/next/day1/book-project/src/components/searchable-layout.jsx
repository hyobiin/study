import style from './searchable-layout.module.css'
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function SearchableLayout({children}){

  const router = useRouter();

  const [search, setSearch] = useState("");

  const q = router.query.q;

  const onChangeSearch = (e) => {
    setSearch(e.target.value); // 이거 없으면 value가 search 값이기 때문에 입력이 안됨
  }

  const onKeyDown = (e) => {
    if(e.key === 'Enter'){
      onSubmit();
    }
  }

  const onSubmit = () => {
    if(!search || q === search) return;
    router.push(`/search?q=${search}`);
  }

  useEffect(() => {
    setSearch(q || "") // q 값이 없을 때 공백으로 넣어라
  } , [q]);

  return(
    <div>
      <div className={style.searchbar_container}>
        <input
          value={search}
          onKeyDown={onKeyDown}
          onChange={onChangeSearch}
          placeholder="검색어를 입력해주세요."
        />
        <button onClick={onSubmit}>검색</button>
      </div>
      {children}
    </div>
  )
}