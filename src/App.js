import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { Provider } from 'react-redux';
import store from './redux/store';
import AdminDashboard from './admin/AdminDashboard';
import SideDashboard from './admin/SideDashboard';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';
import CreatePost from './admin/CreatePost';
import CreateSidePost from './admin/SidePostCreate';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Layout from './admin/global/Layout'
import EditPost from './admin/EditPost';
import EditSidePost from './admin/EditSidePost';
import UserDashboard from './user/UserDashboard';
import SinglePost from './pages/SinglePost';


//HOC
const CreateSidePostHOC = Layout(CreateSidePost);
const AdminSideBarDashboardHOC=Layout(SideDashboard)
const AdminDashboardHOC = Layout(AdminDashboard);
const CreatePostHOC = Layout(CreatePost);
const EditPostHOC = Layout(EditPost);
const EditSidePostHOC= Layout(EditSidePost)
const UserDashboardHOC = Layout(UserDashboard);

const App = () => {
  return (
    <>
      <ToastContainer />
      <Provider store={store}>
        <ProSidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<LogIn />} />
              <Route path='/register' element={<Register />} />
              <Route path='/post/:id' element={<SinglePost />} />
              <Route path='*' element={<NotFound />} />
              <Route path='/admin/dashboard' element={<AdminRoute><AdminDashboardHOC /></AdminRoute>} />
              <Route path='/admin/sidedashboard'element={<AdminRoute><AdminSideBarDashboardHOC/></AdminRoute>}/>
              <Route path='/admin/post/create' element={<AdminRoute><CreatePostHOC /></AdminRoute>} />
              <Route path='/admin/sidepost/create' element={<AdminRoute><CreateSidePostHOC/></AdminRoute>} />
              <Route path='/admin/post/edit/:id' element={<AdminRoute><EditPostHOC /></AdminRoute>} />
              <Route path='/admin/sidepost/edit/:id' element={<AdminRoute>< EditSidePostHOC/></AdminRoute>} />
              <Route path='/user/dashboard' element={<UserRoute><UserDashboardHOC /></UserRoute>} />
            </Routes>
          </BrowserRouter>
        </ProSidebarProvider>

      </Provider>
    </>
  )
}

export default App