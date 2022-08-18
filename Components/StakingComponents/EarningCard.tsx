import styles from "./earningCard.module.css";
import { FC } from "react";
import Image from "next/image";
import { BigNumber, utils } from "ethers";
import CustomToast, { STATUS, TYPE } from "../CustomToast";
import { toast } from "react-toastify";
import { truncateString } from "../../utils/helpers";

interface IProps {
    id: number;
    contractAddress: string;
    rewardTokenDecimals: number;
    rewardTokenSymbol: string;
    rewardTokenPrice: number;
    userEarned: BigNumber | undefined;
    harvest: (stakingAddress: string, pId: number, callbacks: {
        [key: string]: (errorMessage?: string | undefined) => void;
    }) => void
}

const EarningCard: FC<IProps> = (props) => {
    const {
        id,
        contractAddress,
        rewardTokenDecimals,
        rewardTokenSymbol,
        rewardTokenPrice,
        userEarned,
        harvest
    } = props;

    const harvestHandler = () => {
        if(!userEarned?.gt(0)) {
            const toastBody = CustomToast({
                message: `You have no ${rewardTokenSymbol} earnings to widthraw`,
                status: STATUS.ERROR,
                type: TYPE.ERROR,
            });
            return toast(toastBody);
        }
        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                const toastBody = CustomToast({
                    message: `Withdrawing ${rewardTokenSymbol} earnings`,
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
            },
            successfull: async () => {
                const toastBody = CustomToast({
                    message: `Successfully Withdrawn ${rewardTokenSymbol} earnings`,
                    status: STATUS.SUCCESSFULL,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
            },
            failed: (errorMessage?: string) => {
                const toastBody = CustomToast({
                    message: errorMessage
                        ? truncateString(errorMessage, 100)
                        : `Error Withdrawing ${rewardTokenSymbol} earnings`,
                    status: STATUS.ERROR,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
            },
        };

        harvest(contractAddress, id, callbacks);
    }
    

    return (
        <div className={styles.root}>
            <div className={styles.heading}>
                <div className={styles.token__logo}>
                    <Image
                        src={`/token-icons/${rewardTokenSymbol}.png`}
                        alt={`${rewardTokenSymbol} logo`}
                        layout="fill"
                    />
                </div>
                <span className={styles.dollar__value}>{`~ $${
                    (Number(
                        utils.formatUnits(userEarned!, rewardTokenDecimals)
                    ) * rewardTokenPrice).toFixed(2)
                }`}</span>
            </div>

            <div className={styles.token__section}>
                <span className={styles.token__name}>{rewardTokenSymbol}</span>
                <span className={styles.token__amount}>
                    {Number(
                        utils.formatUnits(userEarned!, rewardTokenDecimals)
                    ).toFixed(2)}
                </span>
            </div>

            <div className={styles.withdraw__section}>
                <button
                    className={styles.withdraw__button}
                    onClick = {harvestHandler}
                >{`withdraw ${rewardTokenSymbol}`}</button>
            </div>
        </div>
    );
};

export default EarningCard;
