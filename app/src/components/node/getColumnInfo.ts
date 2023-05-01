export function getColumnInfo(sqlQuery: any) {
    console.log(sqlQuery);
    const regex = /AS\s+([^\s,]+)/g;
    const matches = [];
    let match;
    while (match = regex.exec(sqlQuery)) {
        matches.push(match[1]);
    }

    console.log(matches);
    return matches;
}

export default getColumnInfo;
