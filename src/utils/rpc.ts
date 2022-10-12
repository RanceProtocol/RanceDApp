import Web3 from "web3";

export const rpcUrls = [
    "https://rpc.vvs.finance",
    "https://mmf-rpc.xstaking.sg/",
    "https://evm-cronos.crypto.org",
    "https://cronosrpc-1.xstaking.sg",
    "https://rpc.nebkas.ro/",
    "https://cronosrpc-2.xstaking.sg",
    "https://rpc.artemisone.org/cronos/",
];

const web3 = new Web3(rpcUrls[0]!);
export let counter = 1;

export const getRPC = async () => {
  for(;;){
    let connected = false;

    try{
      connected = await web3.eth.net.isListening();
    }catch(error:any){
      console.error("rpc error Message", error.message);
      connected = false;
    }

    if(!connected){
      console.log(`cro rpc: Changing Provider to ${rpcUrls[counter]}`);
      web3.setProvider(rpcUrls[counter]);
      counter = counter+1 === rpcUrls.length ? 0 : counter+1;
    }else{
        return rpcUrls[counter-1]
    }
  }
}

