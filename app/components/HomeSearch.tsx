import { FiSearch } from "react-icons/fi";

export default function HomeSearch () {
    return (
        <section className="w-4/5 md:w-3/5 flex flex-col items-center gap-4">
            <h2 className="text-lg md:text-xl">Top Featured Listed Properties</h2>
            <div className="inputDiv">
                <FiSearch />
                <input type="search" className="" />
            </div>
        </section>
    )
}