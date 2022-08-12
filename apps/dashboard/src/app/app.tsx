import { Route, Routes } from "react-router-dom"

import NavBar from "src/components/navbar"
import Home from "src/pages/home"
import SSO from "src/pages/sso"
import MyGroups from "src/pages/my-groups"
import Manage from "src/pages/manage"

export function App() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sso" element={<SSO />} />
                <Route path="/my-groups" element={<MyGroups />} />
                <Route path="/manage" element={<Manage />} />
            </Routes>
        </>
    )
}

export default App
