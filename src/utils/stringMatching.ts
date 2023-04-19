
const getTranspositions = (ar: number[]) => {
    let transpositions = 0;
    const sortedAr = [...ar].sort((a, b) => a - b);
    for (let i = 0; i < ar.length; i++) {
        transpositions += +(sortedAr[i] !== ar[i]); //looks sus but I have to do this or ts will complain
    }
    console.log(sortedAr);
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
    console.log(matches, transpositions, (matches.length / a.length + matches.length / b.length + (matches.length - transpositions) / matches.length) / 3);
    return (matches.length / a.length + matches.length / b.length + (matches.length - transpositions) / matches.length) / 3;

}
export const similar = (a: string, b: string) => {
    if (a.startsWith(b)) return true;
    for (let length = a.length; length <= b.length; length++) {
        if (jaroScore(a, b.substring(0, length)) >= .8) return true;
    }
    return false;
}

