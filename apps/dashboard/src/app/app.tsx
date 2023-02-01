import { Route, Routes } from "react-router-dom"
import NavBar from "../components/navbar"
import NotFoundPage from "../pages/404"
import Home from "../pages/home"
import Manage from "../pages/manage"
import MyGroups from "../pages/my-groups"
import SSO from "../pages/sso"

export function App() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sso" element={<SSO />} />
                <Route path="/my-groups" element={<MyGroups />} />
                <Route path="/my-groups/:groupName" element={<Manage />} />
                <Route path="/*" element={<NotFoundPage />} />
            </Routes>
        </>
    )
}

export default App
