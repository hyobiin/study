import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
    return(
        <>
            <nav className='menu_list'>
                <Link to='pages/Test'>Test 모음</Link>
                <Link to='pages/tictactoe/reference/TodoList'>Todo List</Link>
                <Link to='components/BtnInfo'>도움말 팝업</Link>
            </nav>

            <Outlet />
        </>
    )
}

export default Layout;