function calculateHeuristic(layout) {
    const n = layout.length;
    const hValues = {};
    for (let j = 0; j < n; j++) {  // Iterate over each column
        for (let i = 0; i < n; i++) {
            if (layout[i][j] === "x") {

                for (let k = 0; k < n; k++) {
                    if (k !== i) {
                        const newLayout = JSON.parse(JSON.stringify(layout));
                        newLayout[i][j] = "o";
                        newLayout[k][j] = "x";
                        const hValue = calculateAttackPairs(newLayout);
                        hValues[`${i},${j},${k},${j}`] = hValue;
                    }
                }
            }
        }
    }
    return hValues;
}

function calculateAttackPairs(layout) {
    const n = layout.length;
    let h = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (layout[i][j] === "x") {
                // Check for queens attacking along rows
                h += layout[i].filter((_, k) => layout[i][k] === "x" && k !== j).length;
                // Check for queens attacking diagonally
                for (let k = 1; k < n; k++) {
                    if (i + k < n && j + k < n && layout[i + k][j + k] === "x") {
                        h++;
                    }
                    if (i + k < n && j - k >= 0 && layout[i + k][j - k] === "x") {
                        h++;
                    }
                    if (i - k >= 0 && j + k < n && layout[i - k][j + k] === "x") {
                        h++;
                    }
                    if (i - k >= 0 && j - k >= 0 && layout[i - k][j - k] === "x") {
                        h++;
                    }
                }
            }
        }
    }
    // Each attack is counted twice, so divide by 2 to get the correct count
    return Math.floor(h / 2);
}

function findKeyWithPattern(hValues, pattern) {
    for (const key in hValues) {
        if (key.endsWith(pattern)) {
            return key.split(',').map(Number);
        }
    }
    return null;
}

function printBoard(layout, hValues) {
    const n = layout.length;
    const newBoard = Array.from({ length: n }, () => Array(n).fill('o'));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (layout[i][j] === "x") {
                newBoard[i][j] = "Q ";
            } else {
                const key = findKeyWithPattern(hValues, `${i},${j}`);
                newBoard[i][j] = key ? hValues[key.join(',')] : "";
            }
        }
    }
}