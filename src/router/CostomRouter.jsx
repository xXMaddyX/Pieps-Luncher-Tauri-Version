import { useNavigate } from "react-router-dom";

const CustomRouter = () => {
    const navigate = useNavigate();

    const goToHome = () => navigate("/");
    const goToAbout = () => navigate("about");
    const goToOptions = () => navigate("options");

    return {
        goToAbout,
        goToHome,
        goToOptions,
    }
}

export default CustomRouter;