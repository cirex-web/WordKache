import { useEffect, useRef } from "react"

export const wait = (ms: number) => new Promise((re) => setTimeout(re, ms));

export const cloneObj = (obj: any): any => {
    if (!obj || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) {
        return [...obj.map(element => cloneObj(element))]
    } else {
        const clone = Object.assign({}, obj);
        for (const key in obj) {
            clone[key] = cloneObj(obj[key]);
        }
        return clone;
    }
}

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