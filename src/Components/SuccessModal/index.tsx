import Image from "next/image";
import React, { FC } from "react";
import ModalWrapper from "../ModalWrapper";
import styles from "./styles.module.css";

interface IProps {
    state: {
        open: boolean;
        heading: string;
        text: string;
        buttonText: string;
    };
    action: () => void;
    onClose: () => void;
}

const SuccessModal: FC<IProps> = ({ state: {open, heading, text, buttonText}, action, onClose}) => {
    return (
        <ModalWrapper
            open={open}
            label="Success Modal"
            onClose={onClose}
            contentClassName={styles.root}
        >
            <button className={styles.close__btn} onClick={onClose}>
                <div className={styles.close__icon__wrapper}>
                    <Image
                        src={`/icons/close.svg`}
                        alt="modal close icon"
                        layout="fill"
                    />
                </div>
            </button>
            <div className={styles.main__icon}>
                <Image
                    src={`/icons/success.png`}
                    alt="success icon"
                    layout="fill"
                />
            </div>
            <h1 className={styles.heading}>{heading}</h1>
            <p className={styles.text}>{text}</p>
            <button className={styles.btn} onClick={action}>{buttonText}</button>
        </ModalWrapper>
    );
};

export default SuccessModal;
