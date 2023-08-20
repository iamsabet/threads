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

export const getContrastingColor = (color: any) => {
    // Remove the '#' character if it exists
    const hex = color.replace("#", "");

    // Convert the hex string to RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate the brightness of the color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return black or white depending on the brightness
    return brightness > 128 ? "black" : "white";
};