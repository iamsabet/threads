export const formattedDateString = (date: string) => {
    const newDate = new Date(date);

    const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        day: "numeric",
        month: "short",
        year: "numeric",
    };
    let dateSplitted = newDate
        // @ts-ignore
        .toLocaleString("en-US", options)
        .split(", ")
        .reverse();

    return dateSplitted[0] + ", " + dateSplitted[2] + " - " + dateSplitted[1];
};