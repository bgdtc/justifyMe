import { EOL } from 'os';

export function justifyText(texte: string, lineLength: number = 80): string {

    const words = texte.split(' ');

    // transform into an array of lines of 80 chars
    const lines = words.reduce((justifiedLinesArray, word) => {
        // index starts at 0, so we decrement by 1 
        const lastIndex = justifiedLinesArray.length - 1;
        const actualLine = justifiedLinesArray[lastIndex];
        const actualLineLength = actualLine.length;

        // if actual line length + word length + 1 dépasse pas la limite alors ça rajoute le mot à la fin
        if (actualLineLength + word.length + 1 <= lineLength) {
            justifiedLinesArray[lastIndex] = actualLine + (actualLine ? ' ' : '') + word;
        } else {
        // sinon ça push une nouvelle ligne avec le mot
            justifiedLinesArray.push(word);
        }
        // on retourne le tableau de lignes justifiées
        return justifiedLinesArray;
    },['']);

    // transform array of lines of 80 chars into array of lines of 80 chars justified
    const justifiedLines = lines.map((line, index) => {

        // check if the actual mapped line is the last line of the array
        // if so, return the line because the last line isn't justified
        if (index === lines.length - 1) return line;

        // calc the number of space in the actual line and the number of spaces
        // remaining to 80 chars
        const spaces = line.match(/\s/g) || [];
        const spacesCount = spaces.length;
        const spacesRemaining = lineLength - line.length;

        // si pas d'espace alors on retourne la line
        if (spacesCount === 0) return line;

        // on vient ensuite checker le nombre d'espaces à ajouter 
        let additionalSpaces = Array(spacesCount).fill(Math.floor(spacesRemaining / spacesCount));
        const spacesLeft = spacesRemaining % spacesCount;

        additionalSpaces = additionalSpaces.map((space, index) => {
            if (index < spacesLeft) return space + 1;
            return space;
        });

        // split the line into words
        const wordsLine = line.split(' ');

        // recreate an array of justified lines + the spaces dispatched
        return wordsLine.reduce((justifiedLine, word, index) => {
            const wordSpace = index < additionalSpaces.length ? additionalSpaces[index] : 0;
            return justifiedLine + word + ' '.repeat(1 + wordSpace);
        }, '');
    });

    //  return the array of justified lines with end of line after each line
    return justifiedLines.join(EOL);
}

export const alignLeftText = () => {

};

export const alignRightText = () => {

};