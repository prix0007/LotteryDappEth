import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useMyContract from "../hooks/useMyContract";
import useMyTokenContract from "../hooks/useMyTokenContrac";
import { parseBalance } from "../util";

type IContractInfo = {
  rate?: number;
  balance?: string;
};

const MyContract = () => {
  const { account } = useWeb3React<Web3Provider>();
  const myContract = useMyContract();
  const [lotterTokenContract, setLotteryToken] = useState("");
  const tokenContract = useMyTokenContract(lotterTokenContract);

  const [contractInfo, setContractInfo] = useState<IContractInfo>({});
  useEffect(() => {
    (async () => {
      const paymentToken = await myContract.paymentToken();
      setLotteryToken(paymentToken);

      setContractInfo({
        ...contractInfo,
        rate: (await myContract.purchaseRatio()).toNumber(),
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const userBalance = (await tokenContract?.balanceOf(account))?.toString();
      setContractInfo({
        ...contractInfo,
        balance: userBalance,
      });
    })();
  }, [tokenContract]);

  const [buyInput, setBuyInput] = useState("");

  const onHandleBuyToken = async () => {
    console.log(buyInput);
    if (buyInput === "0") {
      console.log("Wrong Balance...");
      return;
    }
    try {
      await myContract.purchaseTokens({ value: buyInput });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <h1>Lottery Dapp Contract</h1>
      <div>
        <h5>
          Your Token Balance: {parseBalance(contractInfo.balance || "0")}{" "}
          Lottery Token
        </h5>
      </div>
      <div>
        <h3>Buy Tokens</h3>
        <div>
          <p>Current Rate: {contractInfo.rate} LOTTERY TOKENS/ETH</p>
          <input
            type="number"
            placeholder="input your amount in eth to buy , 1 eth, 0.1eth etc."
            onChange={(e) => {
              setBuyInput(
                ethers.utils.parseEther(e.target.value || "0").toString()
              );
            }}
          />
          <button onClick={onHandleBuyToken}>Buy</button>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default MyContract;
