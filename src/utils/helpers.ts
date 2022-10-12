export const isValidAmountValue = (value:string) =>
    /^[0-9]*(?:\.[0-9]*)?$/.test(value);
    
export const isPositiveInt = (value:string) => /^\+?([1-9]\d*)$/.test(value);

export const padZero = (num: number) => {
    if(num > 9)
      return num
    return `0${num}`
}

export const getChainId = () => {
    return process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT === "mainnet" || process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT === "staging" ? 25 : 338
}

export const shortenAddress = (address: string): string => {
    if(!address) return "";
    const addressArr = address.split("");
    addressArr.splice(6,32, "...");
    address = addressArr.join("");
    return address;
}

export const structOutputToObject = (structOutput: any[] & {[key:string]: any}):any  => {
    return Object.fromEntries(Object.entries(structOutput).filter(([key]) => isNaN(Number(key))));
}

export const truncateString = (str:string, num:number): string => {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }