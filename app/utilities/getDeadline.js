import dayjs from 'dayjs'
export const getDaysRemaining = (academicYear) => {
    if (JSON.parse(localStorage.getItem("deadlines"))) {
        let deadline = JSON.parse(localStorage.getItem("deadlines")).find(d => d?.academic_year == academicYear)?.deadline
        const currentDate = dayjs();
        const difference = dayjs(deadline).diff(currentDate, 'day');
        // let difference = diff == 1 ? `you are remaining with only today` : diff == 0 ? `your time is up` : diff > 1 ? `you are remaining with ${diff} days` : `Your submission is due by ${Math.abs(diff)} days`
        return difference
    }
    else {
        return "NaN"
    }
};