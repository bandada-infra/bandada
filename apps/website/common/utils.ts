import clsx, { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// add or remove element from array
export const arrayToggle = (arr: any[], value: any) => {
    if (arr.includes(value)) {
        return arr.filter((item) => item !== value)
    }
    return [...arr, value]
}
