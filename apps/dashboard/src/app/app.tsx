import { Route, Routes } from "react-router-dom"

import NavBar from "src/components/navbar"
import Home from "src/pages/home"
import Login from "src/pages/login"

export function App() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    )
}

export default App
