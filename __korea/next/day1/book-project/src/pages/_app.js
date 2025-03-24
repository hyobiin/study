import "@/styles/globals.css";
import GlobalLayout from '../components/Global-layout';

export default function App({ Component, pageProps }) {

  // getLayout 여부에 따라 분기 처리
  // ?? = null
  const getLayout = Component.getLayout ?? ((page) =>  page);

  console.log(Component.getLayout);
  
  return (
    <GlobalLayout>
      {getLayout(<Component {...pageProps} />)}
    </GlobalLayout>
  );
}
