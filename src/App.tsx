import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "./components/ui/loader/loader";
import WordDetailPage from "./components/ui/wordDetailPage";
const HomeLayout = lazy(() => import("./layout/HomeLayout"));

function App() {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path='/' element={<HomeLayout />} />
                <Route path='/word/:id' element={<WordDetailPage />} />
                <Route path='*' element={<Navigate to={"/"} />} />
            </Routes>
        </Suspense>
    );
}

export default App;
