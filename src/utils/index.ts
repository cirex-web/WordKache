import { useEffect, useRef } from "react"

export const wait = (ms: number) => new Promise((re) => setTimeout(re, ms));


export const useFocus = () => {
    const focus = () => {
        inputRef.current?.focus();
        inputRef.current?.select();
    };
    const inputRef = useRef<HTMLInputElement>(null);
    return [inputRef, focus] as const;
}

export const usePrev = <T,>(state: T) => {
    const prevRef = useRef(state);
    useEffect(() => {
        prevRef.current = state;
    }, [state]);
    return prevRef.current;
}