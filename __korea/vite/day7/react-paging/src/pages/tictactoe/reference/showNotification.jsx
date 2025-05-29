
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function showNotification(message, theme){
    toast(message, {
        position: 'top-right',
        autoClose: 2000,
        theme: theme === 'dark' ? 'dark' : 'light'
    });
}