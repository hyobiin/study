import './index.css';
import Test from './pages/Test';
import { Routes, Route } from 'react-router-dom';
import TodoList from './pages/tictactoe/reference/TodoList';
import Layout from './layout';
import BtnTop from './components/BtnTop';
import BtnInfo from './components/BtnInfo';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='pages/Test' element={<Test />}/>
          <Route path='pages/tictactoe/reference/TodoList' element={<TodoList />}/>
          <Route path='components/BtnInfo' element={<BtnInfo />}/>
        </Route>
      </Routes>

      <BtnTop />
    </>
  )
}

export default App