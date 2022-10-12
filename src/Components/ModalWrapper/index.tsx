import React, { FC, ReactNode } from "react";
import Modal from "react-modal";
import styles from "./styles.module.css";

interface IProps {
    open: boolean;
    onClose: () => void;
    onAfterClose?: () => void;
    label: string;
    contentClassName: string;
    children: ReactNode;
}
Modal.setAppElement("#__next");

const ModalWrapper: FC<IProps> = ({
    open,
    onClose,
    onAfterClose,
    label,
    contentClassName,
    children,
}) => {
    return (
        <Modal
            closeTimeoutMS={300}
            isOpen={open}
            onRequestClose={onClose}
            onAfterClose={onAfterClose && onAfterClose}
            contentLabel={label}
            overlayClassName={styles.overlay}
            className={contentClassName}
        >
            {children}
        </Modal>
    );
};

export default ModalWrapper;
