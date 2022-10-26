import { Route, Routes } from "react-router-dom"
import Home from "src/pages/home"
import PermissionGroup from "src/pages/permission-group"

export function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/redeem/invite/:groupName/:invitationCode" element={<PermissionGroup />} />
        </Routes>
    )
}

export default App
