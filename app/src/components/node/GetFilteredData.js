// const conditions = [">", "<", ">=", "<=", "=", "LIKE", "IN", "NOT LIKE"];
// 수정 필요
// 1. 고정된 field name >> 자료형을 매칭하기 위함 이를 위해선 자료형까지 node에서 받아올 필요가 있다
// 2. date는 == 안됨 참고할 것
// 3. IN 구현 좀 더 고민
const isSameDate = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}

const isSameTime = (date1, date2) => {
    return date1.getTime() === date2.getTime();
}

export function GetFilteredData(originData, fieldStates) {
    console.log(originData);
    console.log(fieldStates);
    return originData.filter((item) => {
        let matchCount = 0;
        let condCount = 0;

        for (const field in fieldStates) {
            if (field === "orFilter") continue;

            const condition = fieldStates[field].condition;
            const filterValue = fieldStates[field].filterValue;

            if (condition && filterValue) {
                condCount++;
                const value = item[field];
                console.log(value);

                switch (condition) {
                    case ">":
                        if (field === "LOG_DATE") {
                            if (new Date(value) > new Date(filterValue)) matchCount++;
                        } else if (field === "LOG_TIME") {
                            if (new Date(`1970-01-01T${value}`) > new Date(`1970-01-01T${filterValue}`)) matchCount++;
                        } else {
                            if (parseInt(value, 10) > parseInt(filterValue, 10)) matchCount++;
                        }
                        break;

                    case "<" :
                        if (field === "LOG_DATE") {
                            if (new Date(value) < new Date(filterValue)) matchCount++;
                        } else if (field === "LOG_TIME") {
                            if (new Date(`1970-01-01T${value}`) < new Date(`1970-01-01T${filterValue}`)) matchCount++;
                        } else {
                            if (parseInt(value, 10) < parseInt(filterValue, 10)) matchCount++;
                        }
                        break;

                    case ">=" :
                        if (field === "LOG_DATE") {
                            if (new Date(value) >= new Date(filterValue)) matchCount++;
                        } else if (field === "LOG_TIME") {
                            if (new Date(`1970-01-01T${value}`) >= new Date(`1970-01-01T${filterValue}`)) matchCount++;
                        } else {
                            if (parseInt(value, 10) >= parseInt(filterValue, 10)) matchCount++;
                        }
                        break;

                    case "<=" :
                        if (field === "LOG_DATE") {
                            if (new Date(value) <= new Date(filterValue)) matchCount++;
                        } else if (field === "LOG_TIME") {
                            if (new Date(`1970-01-01T${value}`) <= new Date(`1970-01-01T${filterValue}`)) matchCount++;
                        } else {
                            if (parseInt(value, 10) <= parseInt(filterValue, 10)) matchCount++;
                        }
                        break;

                    case "=" :
                        if (field === "LOG_DATE") {
                            if (isSameDate(new Date(value), new Date(filterValue))) matchCount++;
                        } else if (field === "LOG_TIME") {
                            if (isSameTime(new Date(`1970-01-01T${value}`), new Date(`1970-01-01T${filterValue}`))) matchCount++;
                        } else {
                            if (parseInt(value, 10) == parseInt(filterValue, 10)) matchCount++;
                        }
                        break;

                    case "LIKE":
                        if (value.toString().includes(filterValue.toString())) matchCount++;
                        break;

                    case "IN": // 미구현
                        matchCount++;
                        break

                    case "NOT LIKE":
                        if (!value.toString().includes(filterValue.toString())) matchCount++;
                        break;
                }
            }
        }

        if (fieldStates.orFilter) {
            return matchCount > 0;
        } else {
            return matchCount === condCount;
        }
    });
}

export default GetFilteredData;
