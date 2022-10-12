import { getDefaultProvider } from "../wallet/utils";

export const getCurrentTimestamp = async (): Promise<number | undefined> => {
    try {
        const provider = getDefaultProvider();
        const blockNumber = await provider.getBlockNumber();
        const { timestamp } = await provider.getBlock(blockNumber);
        return timestamp;
    } catch (error) {
        console.error(error);
    }
};

export const getDateFromTimstamp = (timeStamp: number): string => {
    return new Date(timeStamp * 1000).toLocaleDateString().replaceAll("/", "-");
};

export const getDateStringFromTimstamp = (timeStamp: number): string => {
    const date = new Date(timeStamp * 1000).toDateString().split(" ");
    return `${date[2]} ${date[1]} ${date[3]}`;
};

export interface Time {
    weeks: string;
    days: string;
    hours: string;
    minutes: string;
}

export const zeroPad = (num: number) => {
    const zero = 2 - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
};

export const getCountdown = (duration: number): Time => {
    const [weekInSec, dayInSec, hourInSec, minInSec] = [
        60 * 60 * 24 * 7,
        60 * 60 * 24,
        60 * 60,
        60,
    ];
    const weeks = Math.trunc(duration / weekInSec);
    let remTime = duration - weeks * weekInSec;
    const days = Math.trunc(remTime / dayInSec);
    remTime = duration - days * dayInSec;
    const hours = Math.trunc(remTime / hourInSec);
    remTime = remTime - hours * hourInSec;
    const mins = Math.trunc(remTime / minInSec);
    const secs = Math.trunc(remTime - mins * minInSec);
    const _weeks = zeroPad(weeks);
    const _days = zeroPad(days);
    const _hours = zeroPad(hours);
    const _mins = zeroPad(mins);
    return { weeks: _weeks, days: _days, hours: _hours, minutes: _mins };
};
