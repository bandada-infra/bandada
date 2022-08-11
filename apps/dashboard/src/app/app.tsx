import { Route, Routes } from "react-router-dom"

import NavBar from "src/components/navbar"
import Home from "src/pages/home"
import Sso from "src/pages/sso"

export function App() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sso" element={<Sso />} />
            </Routes>
        </>
    )
}

export default App
