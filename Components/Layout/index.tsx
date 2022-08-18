import { FC, Fragment, ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { toggleAccountModal, toggleWalletModal } from "../../appState/shared/action";
import { useSharedStore } from "../../appState/shared/store";
import useWallet from "../../wallet/hooks/useWallet";
import Header from "../Header";
import {DisconnectedModal, ConnectedModal} from "../WalletModals/";
import "react-toastify/dist/ReactToastify.css";
import styles from './styles.module.css'


interface IProps {
    children: ReactNode;
}

const Layout: FC<IProps> = ({ children }) => {
    const sharedStore = useSharedStore()
    const {accountModalOpened, walletModalOpened} = sharedStore
    const dispatch = useDispatch()
    const { connectWallet, disconnectWallet} = useWallet()
    
    
    return (
        <Fragment>
            <div className={styles.root}>
                <Header />
                {children}
                <ToastContainer
                    position="bottom-right"
                    hideProgressBar={true}
                    closeButton={false}
                    toastClassName = {styles.toast}
                />
            </div>
            <DisconnectedModal 
                open = {walletModalOpened}
                onClose = {() => toggleWalletModal(dispatch)}
                connectWallet = {connectWallet}
            />
            <ConnectedModal 
                open = {accountModalOpened}
                onClose = {() => toggleAccountModal(dispatch)}
                disconnectWallet = {disconnectWallet}
            />
        </Fragment>
    );
};

export default Layout;
