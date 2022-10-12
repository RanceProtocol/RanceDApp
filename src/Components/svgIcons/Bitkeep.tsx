import { FC } from "react";

interface IProps {
    width: string;
    className: string;
}

export const BitKeep: FC<IProps> = ({ width, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 60 60"
        width={width || "40px"}
        color="text"
    >
        <path
            style={{
                stroke: "none",
                fillRule: "evenodd",
                fill: "#7524f9",
                fillOpacity: 1,
            }}
            d="M30 0c16.57 0 30 13.43 30 30S46.57 60 30 60 0 46.57 0 30C0 13.437 13.43 0 30 0Zm0 0"
        />
        <path
            style={{
                stroke: "none",
                fillRule: "evenodd",
                fill: "#fff",
                fillOpacity: 1,
            }}
            d="M48.656 20.758v2.125c0 .414-.222.8-.578 1.008l-6.836 3.941 6.102 3.512a2.625 2.625 0 0 1 1.312 2.273v5.649c0 .937-.504 1.804-1.32 2.273l-16.04 9.203c-.812.461-1.804.461-2.62-.008l-5.25-3.03a.583.583 0 0 1 0-1.009l17.332-9.98a.29.29 0 0 0 0-.504l-6.438-3.719c-.36-.21-.804-.21-1.168 0L15.54 42.641a.895.895 0 0 1-.875 0l-1.992-1.145a2.63 2.63 0 0 1-1.317-2.277v-2.317c0-.308.168-.605.442-.754l25.246-14.507a.296.296 0 0 0 0-.508l-6.445-3.73c-.356-.212-.801-.212-1.168 0l-17.203 9.894a.58.58 0 0 1-.872-.5V20.73c0-.937.504-1.804 1.317-2.273L28.719 9.25a2.642 2.642 0 0 1 2.613 0l16.004 9.234a2.633 2.633 0 0 1 1.32 2.274Zm0 0"
        />
    </svg>
);

export default BitKeep;
