import { useEffect, useRef, useState } from "react";
import { setInterval } from "timers/promises";
import { getCurrentTimestamp } from "../utils/time";

export const useCountdown = (endTimestamp: number) => {
    const timeoutRef = useRef<ReturnType<typeof setInterval | any>>()
    const [formatedTimeLeft, setFormatedTimeLeft] = useState<{
        weeks: number;
        days: number;
        hours: number;
        minutes: number;
    }>({ weeks: 0, days: 0, hours: 0, minutes: 0 });
    const [secondsLeft, setSecondsLeft] = useState<number>();

    useEffect(() => {
        (async () => {
            const currentTimestamp = await getCurrentTimestamp();
            if (!currentTimestamp) return;
            let seconds:number;
            if(endTimestamp < currentTimestamp) {
                // insurance package has ended and currently in the 30 days grace
                seconds = Math.max(((endTimestamp + ((60 * 60 * 24 * 30))) - currentTimestamp), 0);
            } else {
                seconds = Math.max((endTimestamp - currentTimestamp), 0);
            }
            formatTimeLeft(seconds);
            setSecondsLeft(() => seconds);
        })()
    }, []);

    useEffect(() => {
        if (secondsLeft === undefined) return;
        timeoutRef.current = setTimeout(getTimeRemainingAndUpdate, 1000 * 60);
        return () => {
            clearInterval(timeoutRef.current);
        };
    }, [secondsLeft]);
    

    const formatTimeLeft = (secondsLeft: number) => {
        const weeksLeft = Math.floor(secondsLeft! / 604800);
        const r1 = secondsLeft % 604800;
        const daysLeft = Math.floor(r1 / 86400);
        const r2 = r1 % 86400;
        const hoursLeft = Math.floor(r2 / 3600);
        const r3 = r2 % 3600;
        const minutesLeft = Math.floor(r3 / 60);

        setFormatedTimeLeft({
            weeks: weeksLeft,
            days: daysLeft,
            hours: hoursLeft,
            minutes: minutesLeft,
        });
    };

    const getTimeRemainingAndUpdate = () => {
       formatTimeLeft(secondsLeft!)
       const newSecondsLeft = secondsLeft! - 60;
        setSecondsLeft(Math.max(newSecondsLeft, 0))
    }



    return { formatedTimeLeft };
};
