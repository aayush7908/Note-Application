import React from "react";

export default function FormButton({ children, type, disabled, handleClick }) {
    return (
        <button
            type={type ? type : "submit"}
            disabled={disabled}
            onClick={handleClick}
            className="px-[1rem] py-[0.5rem] border-2 rounded-md border-slate-400 bg-slate-200"
        >
            {children}
        </button>
    );
}