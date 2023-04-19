
const getTranspositions = (ar: number[]) => {
    let transpositions = 0;
    const sortedAr = [...ar].sort((a, b) => a - b);
    for (let i = 0; i < ar.length; i++) {
        transpositions += +(sortedAr[i] !== ar[i]); //looks sus but I have to do this or ts will complain
    }
    return transpositions;
}
/** Classic Jaro similarity score implementation (I think) */
const jaroScore = (a: string, b: string) => {
    const searchRange = Math.floor(Math.max(a.length, b.length) / 2) - 1;
    let matches = []; //matched indices of b
    let characterMap = new Map<string, number[]>();
    for (let i = 0; i < b.length; i++) {
        characterMap.set(b[i], characterMap.get(b[i]) ?? []);
        characterMap.get(b[i])!.push(i);
    }

    for (let i = 0; i < a.length; i++) {
        const existingMatches = characterMap.get(a[i]);
        while (existingMatches?.length) {
            const j = existingMatches[0];
            if (Math.abs(i - j) <= searchRange) {
                matches.push(j);
                existingMatches.splice(0, 1);
                break;
            } else if (j < i) {
                existingMatches.splice(0, 1);
            } else {
                break;
            }
        }
    }
    if (matches.length === 0) return 0;
    const transpositions = getTranspositions(matches) / 2;
    return (matches.length / a.length + matches.length / b.length + (matches.length - transpositions) / matches.length) / 3;

}
/**
 * Note that order of params matters
 * @param a First string
 * @param b Second (transformed) string 
 * @returns Whether or not they're "similar"
 */
export const similar = (a: string, b: string) => {
    // if (a.length > b.length) [a, b] = [b, a]; //shorter string first
    for (let length = Math.min(a.length, b.length); length <= b.length; length++) {
        if (jaroScore(a, b.substring(0, length)) >= .8) return true;
    }
    return false;
}

// type RecursiveObject = { [key: string|number]: RecursiveObject | string };
// export const sanitize = <T>(s: T):T extends string?string:RecursiveObject => {
//     if (typeof s === 'object') {
//         for (const [key, val] of Object.entries(s)) {
//             s[key] = sanitize(val);
//         }
//         return s;
//     } else {
//         return s.trimEnd().trimStart(); //the actual sanitize method
//     }
// }
export const sanitize = (s: string) => {
    return s.trimEnd().trimStart();
} 