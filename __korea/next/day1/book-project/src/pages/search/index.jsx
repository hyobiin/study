import SearchableLayout from "@/components/searchable-layout";
import { useRouter } from "next/router"

export default function Page(){

  const router = useRouter(); // 경로 정보 알려줌

  console.log(router);

  const { q } = router.query; // 객체 디스트럭쳐링
  // == const q = router.query.q;
  

  return (
    <h1>Search {q}</h1>
  )
}

Page.getLayout = (page) => {
  return <SearchableLayout>{page}</SearchableLayout>
}