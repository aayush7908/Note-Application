import React from "react";

export default function FormButton({ children, disabled }) {
    return (
        <button
            disabled={disabled}
            className="px-[1rem] py-[0.5rem] border-2 rounded-md border-slate-400 bg-slate-200"
        >
            {children}
        </button>
    );
}