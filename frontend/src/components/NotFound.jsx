import React from 'react';
import { Link } from 'react-router-dom';
import { Frown } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex justify-center items-center">
            <div className="grid gap-4 text-center">
                <div className="flex justify-center">
                    <Frown className="size-[10rem]" />
                </div>
                <h2 className="font-semibold text-5xl">404</h2>
                <h2 className="font-semibold text-2xl">Page Not Found</h2>
                <p>The page you are looking for doesnot exist.</p>
                <p>Click <Link to={"/"} className="underline text-blue-600">here</Link> to go back to main page</p>
            </div>
        </div>
    );
};