import { Search } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchForm() {

    const searchKeyword = useRef(null);
    const [searchParams] = useSearchParams();

    const handleSubmit = (event) => {
        event.preventDefault();
        window.location.replace(`?searchKeyword=${searchKeyword.current.value}`);
    }

    useEffect(() => {
        searchKeyword.current.value = searchParams.get("searchKeyword") || "";
    }, []);

    return (
        <div className="flex justify-end mb-[1rem]">
            <form
                onSubmit={handleSubmit}
                className="flex justify-center items-center gap-[0.5rem]"
            >
                <input
                    type="text"
                    placeholder="Search"
                    ref={searchKeyword}
                    className="px-[1rem] py-[0.5rem] font-medium border-2 rounded-full border-slate-400 bg-slate-200 focus:bg-slate-100"
                    autoFocus={true}
                />
                <button
                    className="flex justify-center items-center p-[0.4rem] border-2 rounded-full border-slate-400 bg-slate-200 hover:bg-slate-300"
                >
                    <Search />
                </button>
            </form>
        </div>
    );
}