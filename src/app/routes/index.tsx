import {Routes, Route} from "react-router-dom";
import MainPage from "../../Listing";
import FavoriteRepo from "../../FavoriteRepo";
import NotFoundPage from "../../PageNotFound";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/favorites" element={<FavoriteRepo />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default AppRoutes;