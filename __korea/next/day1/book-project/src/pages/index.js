import style from './index.module.css'
import SearchableLayout from "@/components/searchable-layout"
import books from '@/mock/books.json'; // @ => src 폴더를 의미
import BookItem from "@/components/book-item";
import { useEffect } from 'react';

// getServerSideProps는 Next에서 약속된 함수
// 컴포넌트보다 먼저 실행이 되어서, 컴포넌트에 필요한 데이터를 불러오는 함수
// (서버측에서 실행되는 함수)
export const getServerSideProps = () => {
  console.log('서버에서 실행되는 함수이므로 브라우저에서 로그가 찍히지 않고 터미널에 찍힘')

  try{
    console.log(window.location);
  }catch(error){
    console.log(error.message);
  }

  const data = 'hello';

  return{
    props:{data}
  }
}

export default function Home({data}){

  // 사전 렌더링으로 인해 서버에서 한 번 그리고 클라이언트에서 한 번 실행 됨
  // 사전 렌더링: 웹 페이지의 콘텐츠를 미리 생성하여 사용자가 요청하기 전에 준비해 두는 방식
  console.log(data);

  try{
    console.log(window.location);
  }catch(error){

  }

  useEffect(() => {
    console.log('useEffect는 브라우저에서 실행됨');
    console.log(window.location);
  }, [])

  return(
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {books.map((book) => <BookItem key={book.id} {...book} />)}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {books.map((book) => <BookItem key={book.id} {...book} />)}
      </section>
    </div>
  )
}

// 검색바가 있고 없는 페이지를 분기처리 하기 위해 메소드 처리
Home.getLayout = (page) => {
  return <SearchableLayout>{page}</SearchableLayout>
}