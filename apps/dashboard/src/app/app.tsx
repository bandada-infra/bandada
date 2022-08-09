import { Route, Routes } from "react-router-dom"

import NavBar from "../components/navbar"
import Home from "../pages/home"
import Login from "../pages/login"
import Join from "../pages/join"

export function App() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
            </Routes>
        </>
    )
}

export default App
