import {useEffect, useState} from "react";
import {Navbar} from "../../components/Navbar";
import {Footer} from "../../components/Footer";
import {AdminMovieAddSection} from "./components/AdminMovieAddSection";
import {AdminShowtimesAddSection} from "./components/AdminShowtimesAddSection";
import {AdminShownInModifySection} from "./components/AdminShownInModifySection";
import {AdminDashboardPrimary} from "./components/AdminDashboardPrimary";
import {MovieWiseTicket} from "./components/MovieWiseTicket";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader.js";

const AdminPage = () => {
    const [selectedShowDate, setSelectedShowDate] = useState("");

    const handleSelectedDate = (e) => {
        setSelectedShowDate(e.target.value);
    };

    const [movieData, setMovieData] = useState([]);
    const [loading, setLoading] = useState(true);

    const override = {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/latestMovies`
                );
                // console.info("===========[] ===========[response.data] : ",response.data);
                setMovieData(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Navbar/>
            <AdminDashboardPrimary/>
            <MovieWiseTicket/>
            <AdminMovieAddSection/>
            {/* <section className="section-home-collection" id="nowShowing">
                <div className="home-collection-heading-container">
                    <h1 className="heading-secondary heading-collection">
                        Danh sách phim
                    </h1>
                </div>

                {loading && <HashLoader cssOverride={override} color="#eb3656"/>}
                <div className="home-collection-container">
                    {!loading && movieData}
                </div>
            </section> */}
            {/* <AdminShowtimesAddSection
                selectedShowDate={selectedShowDate}
                setSelectedShowDate={setSelectedShowDate}
                handleSelectedDate={handleSelectedDate}
            /> */}
            <AdminShownInModifySection selectedDate={selectedShowDate}/>
            <Footer/>
        </>
    );
};

export default AdminPage;
