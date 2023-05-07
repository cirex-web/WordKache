import { useRef } from "react"

export const useFocus = () => {
    const focus = () => {
        inputRef.current?.focus();
        inputRef.current?.select();
    };
    const inputRef = useRef<HTMLInputElement>(null);
    return [inputRef, focus] as const;
}