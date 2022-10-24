import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import useMyContract from "../hooks/useMyContract";
import useMyTokenContract from "../hooks/useMyTokenContrac";
import { parseBalance } from "../util";

const ZERO = BigNumber.from(0);

type IContractInfo = {
  rate?: number;
  balance?: string;
};

const MyContract = () => {
  const { account } = useWeb3React<Web3Provider>();
  const myContract = useMyContract();
  const [lotterTokenContract, setLotteryToken] = useState("");
  const [owner, setOwner] = useState("");
  const [betMany, setBetMany] = useState("");
  const [balance, setBalance] = useState(ZERO);
  const [betFee, setBetFee] = useState(ZERO);
  const [betPrice, setBetPrice] = useState(ZERO);
  const [betRewards, setBetRewards] = useState(ZERO);
  const [lotteryState, setLotteryState] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const tokenContract = useMyTokenContract(lotterTokenContract);
  const [buyInput, setBuyInput] = useState("");

  const [contractInfo, setContractInfo] = useState<IContractInfo>({});
  useEffect(() => {
    (async () => {
      setOwner(await myContract.owner());

      const paymentToken = await myContract.paymentToken();
      setLotteryToken(paymentToken);

      const _betFee = await myContract.betFee();
      setBetFee(_betFee);

      const _betPrice = await myContract.betPrice();
      setBetPrice(_betPrice);

      const _lotteryState = await myContract.betsOpen();
      setLotteryState(_lotteryState);

      const _betRewards = await myContract.prize(account);
      setBetRewards(_betRewards);

      setContractInfo({
        ...contractInfo,
        rate: (await myContract.purchaseRatio()).toNumber(),
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const userBalance = await tokenContract?.balanceOf(account);
      // console.log(userBalance);
      setBalance(userBalance);
    })();
  }, [tokenContract]);

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

  const onHandleBet = async () => {
    if (buyInput === "0") {
      console.log("Wrong Balance...");
      return;
    }
    try {
      await tokenContract.approve(
        myContract.address,
        ethers.constants.MaxUint256
      );
      await myContract.bet();
    } catch (e) {
      console.log(e);
    }
  };

  const onHandleBetMany = async () => {
    if (betMany === "0") {
      console.log("Wrong Balance...");
      return;
    }

    try {
      await tokenContract.approve(
        myContract.address,
        ethers.constants.MaxUint256
      );
      await myContract.betMany(betMany);
    } catch (e) {
      console.log(e);
    }
  };

  const onHandleClaimRewards = async () => {
    await myContract.prizeWithdraw(betRewards);
  };

  const onHandleBurn = async () => {
    await myContract.returnTokens(balance);
  };

  const onHandleClose = async () => {
    await myContract.closeLottery();
  };

  const onHandleOpen = async () => {
    const now = Math.floor(Date.now() / 1000);
    await myContract.openBets(now + seconds);
  };

  return (
    <div>
      <h1>Lottery Dapp Contract</h1>
      <h2>Lottery is {lotteryState ? "OPEN" : "CLOSED"}</h2>
      <div>
        <h5>Your Token Balance: {parseBalance(balance || "0", 18)}</h5>
      </div>

      <div>
        <div>
          {lotteryState && owner == account && (
            <button onClick={onHandleClose}>Close Lottery</button>
          )}
          {!lotteryState && owner == account && (
            <>
              <input
                type="number"
                placeholder="Enter lottery time in seconds"
                onChange={(e) => {
                  setSeconds(parseInt(e.target.value || "0"));
                }}
              />
              <button onClick={onHandleOpen}>Open Lottery</button>
            </>
          )}
        </div>
      </div>

      <div>
        <h5>Your REWARDS: {parseBalance(betRewards)} Lottery Token</h5>
        <div>
          {betRewards.isZero() ? null : (
            <button onClick={onHandleClaimRewards}>Claim Rewards</button>
          )}
          {BigNumber.from(balance ?? 0).isZero() ? null : (
            <button onClick={onHandleBurn}>Convert to ETH</button>
          )}
        </div>
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
      <br></br>
      <div>
        <div>
          <h3>Bet Fee: {ethers.utils.formatUnits(betFee.toString())}</h3>
          <h3>Bet Price: {ethers.utils.formatUnits(betPrice)}</h3>
          {lotteryState && <button onClick={onHandleBet}>Bet</button>}
          <div></div>
          {lotteryState && (
            <div>
              <input
                type="number"
                placeholder="input your bets."
                onChange={(e) => {
                  setBetMany(e.target.value);
                }}
              />
              <button onClick={onHandleBetMany}>Bet Many</button>{" "}
            </div>
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default MyContract;
