import { ethers } from "ethers";

export const watchEvent = (
  contract: ethers.Contract, event: string, eventFilterArgs: any[], callback: (..._:any) => void,
  ) => {
    const filter = contract.filters[event](...eventFilterArgs);
    contract.on(filter, callback);
}