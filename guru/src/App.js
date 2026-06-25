import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./assets/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import TranslationObserver from "./components/TranslationObserver";
import Main from "./pages/Main";
import Login from "./pages/Login";
import FindAcct from "./pages/FindAcct";
import Signup from "./pages/Signup";
import SignupOk from "./pages/SignupOk";
import Findjob from "./pages/Findjob";
import JobWrite from "./pages/JobWrite";
import JobEdit from "./pages/JobEdit";
import Mypage from "./pages/Mypage";
import ProfileEdit from "./pages/ProfileEdit";
import PersonalEdit from "./pages/PersonalEdit";
import AppliedList from "./pages/AppliedList";
import JobOffer from "./pages/JobOffer";
import JobDetail from "./pages/JobDetail";
import AcctDelete from "./pages/AcctDelete";
import ResetConfirm from "./pages/ResetConfirm";
import ResetPassword from "./pages/ResetPassword";
import AcctBye from "./pages/AcctBye";
import Footer from "./components/Footer";
import "./css/Reset.css";
import "./css/Common.css";
import "swiper/css";
import "swiper/css/pagination";
import "./css/Swiper.css";

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <TranslationObserver />
        <Header />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/login' element={<Login />} />
          <Route path='/findacct' element={<FindAcct />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signupok' element={<SignupOk />} />
          <Route path='/findjob' element={<Findjob />} />
          <Route
            path='/applied-list'
            element={
              <PrivateRoute>
                <AppliedList />
              </PrivateRoute>
            }
          />
          <Route
            path='/job-offer'
            element={
              <PrivateRoute>
                <JobOffer />
              </PrivateRoute>
            }
          />
          <Route
            path='/job-write'
            element={
              <PrivateRoute>
                <JobWrite />
              </PrivateRoute>
            }
          />
          <Route
            path='/job-edit'
            element={
              <PrivateRoute>
                <JobEdit />
              </PrivateRoute>
            }
          />
          <Route
            path='/job-detail'
            element={
              <PrivateRoute>
                <JobDetail />
              </PrivateRoute>
            }
          />
          <Route
            path='/mypage'
            element={
              <PrivateRoute>
                <Mypage />
              </PrivateRoute>
            }
          >
            <Route path='profileedit' element={<ProfileEdit />} />
            <Route path='personaledit' element={<PersonalEdit />} />
            <Route path='acctdelete' element={<AcctDelete />} />
          </Route>
          <Route path='/resetconfirm' element={<ResetConfirm />} />
          <Route path='/acctbye' element={<AcctBye />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
