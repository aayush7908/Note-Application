import React from 'react';
import { Link } from 'react-router-dom';
import { Frown } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="flex justify-center items-center">
            <div className="grid gap-4 text-center">
                <div className="flex justify-center">
                    <Frown className="size-[10rem]" />
                </div>
                <h2 className="font-semibold text-3xl">404 Not Found</h2>
                <div className="text-lg">
                    <p>The resource you are looking for doesnot exist.</p>
                    <p>Click <Link to={"/"} className="underline text-blue-600">here</Link> to go back to main page</p>
                </div>
            </div>
        </div>
    );
};