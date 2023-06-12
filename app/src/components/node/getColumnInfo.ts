export function getColumnInfo(sqlQuery: any) {
    const regexWithAs = /AS\s+([^\s,]+)/g;
    const regexWithNoAs = /select\s+(.*?)\s+from/i;
    let matches = [];
    let columns;
    let match;

    while (match = regexWithAs.exec(sqlQuery)) {
        matches.push(match[1]);
    }

    match = regexWithNoAs.exec(sqlQuery);

    if (match && match[1]) {
        columns = match[1].split(',').map((column) => column.trim());
        
    }

    //console.log(matches);
    console.log(columns);
    return columns;
}

export default getColumnInfo;
