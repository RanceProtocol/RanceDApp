import styles from "./styles.module.css";
import { BiError } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { RiExchangeLine } from "react-icons/ri";
import clsx from "clsx";
import { ReactNode } from "react";
import { ToastContentProps } from "react-toastify";

export enum STATUS {
    ERROR = "Error",
    PENDING = "Pending",
    SUCCESSFULL = "Successfull",
}

export enum TYPE {
    TRANSACTION = "transaction",
    ERROR = "error",
    SUCCESSFULL = "successfull",
}

interface IProps {
    message: string;
    status: STATUS;
    type: TYPE;
}

const icons = {
    transaction: <RiExchangeLine />,
    error: <BiError />,
    successfull: <IoMdCheckmarkCircleOutline />,
};
const CustomToast =
    ({ message, status, type }: IProps) =>
    // eslint-disable-next-line react/display-name
    ({ closeToast }: ToastContentProps<unknown>): ReactNode =>
        (
            <div className={styles.root}>
                <div
                    className={clsx({
                        [styles.type__icon]: true,
                        [styles.transaction__icon]: type === TYPE.TRANSACTION,
                        [styles.error__icon]: type === TYPE.ERROR,
                        [styles.successfull__icon]: type === TYPE.SUCCESSFULL,
                    })}
                >
                    {icons[type]}
                </div>
                <div className={styles.main}>
                    <IoCloseOutline
                        className={styles.close__icon}
                        onClick={closeToast}
                    />
                    <span className={styles.message}>{message}</span>
                    <span className={styles.status}>
                        Status -{" "}
                        <span
                            className={clsx({
                                [styles.status__error]: status === STATUS.ERROR,
                                [styles.status__pending]:
                                    status === STATUS.PENDING,
                                [styles.status__successfull]:
                                    status === STATUS.SUCCESSFULL,
                            })}
                        >
                            {status}
                        </span>
                    </span>
                </div>
            </div>
        );

export default CustomToast;
