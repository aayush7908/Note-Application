import React from "react";
import { LoaderCircle } from "lucide-react";

export default function Loader() {
    return (
        <div className="flex justify-center">
            <LoaderCircle className="size-[3rem] animate-spin" />
        </div>
    );
}