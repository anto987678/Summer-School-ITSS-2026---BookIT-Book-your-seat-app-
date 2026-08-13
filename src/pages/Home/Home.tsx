import officeBg from '@/assets/office-bg.jpeg'
import { Link } from 'react-router-dom'
import logo_noBG from "@/assets/Logo_without_bg.svg";

const Home = () => {
    return (

        <div
            className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${officeBg})` }}
        >

            <div className="absolute inset-0 bg-[#29255E] opacity-80"></div>


            <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-4 text-center text-white">


                <div className="flex max-w-full items-center justify-center gap-2 sm:gap-3">
                    <img src={logo_noBG} alt="Logo" className="h-10 shrink-0 sm:h-20" />
                    <h1 className="truncate text-[34px] font-semibold text-white sm:text-[64px]">
                        BookIT
                    </h1>
                </div>


                <p className="mb-10 text-base text-gray-200 sm:text-xl">
                    Rezerva-ti locul la birou in cateva secunde. Alege zona,
                    etajul si scaunul preferat - totul dintr-o singura aplicatie.
                </p>

                {/* Butoanele */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <Link
                        to="/signup"
                        className="rounded-lg bg-white px-6 py-3 text-lg font-bold text-[#6D28D9] transition hover:bg-gray-200 sm:px-8 sm:text-xl"
                    >
                        Register
                    </Link>

                    <Link
                        to="/login"
                        className="rounded-lg bg-[#6D28D9] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#5B21B6] sm:px-8 sm:text-xl"
                    >
                        Log in
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Home
