import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import NavBar from './components/NavBar'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './store/userSlice'
import { getUserProfile } from './api/users'
import { type AppDispatch } from './store/store'
import { type RootState } from './store/store'
import GroupChatMakeFormPage from './pages/GroupChatMakeFormPage'
import { GroupRoomPage } from './pages/GroupRoomPage'
import FindRoomPage from './pages/FindRoomPage'
import RoomDrawer from './components/RoomDrawer'
import PlayerDrawer from './components/PlayerDrawer'
import SingleChatMakeFormPage from './pages/SingleChatMakeFormPage'


const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRoomPage = location.pathname.startsWith("/rooms/");
  console.log('Current path:', location.pathname, 'isLoginPage:', isLoginPage, 'isRoomPage:', isRoomPage);

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getUserProfile();
        dispatch(setUser(profile));
      } catch (err) {
        // 인증 안 된 경우 로그인 상태가 아님
      }
    };

    fetchUser();
  }, [dispatch]);

  console.log('Redux user state:', user);

  return (
    <div className="App">
      {!isLoginPage && <NavBar />}
      {!isLoginPage && <RoomDrawer />}
      {isRoomPage && <PlayerDrawer />}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/chat-make" element={<GroupChatMakeFormPage />} />
        <Route path="/single-chat-make" element={<SingleChatMakeFormPage />} />
        <Route path="/rooms/:roomId" element={<GroupRoomPage />} />
        <Route path="/find-rooms" element={<FindRoomPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
export default App
