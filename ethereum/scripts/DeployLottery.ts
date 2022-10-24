import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Lottery__factory } from "../typechain-types";

async function main() {
  const key = process.env.PRIVATE_KEY;
  console.log({ key: `0x${key}` });
  if (!key) {
    console.log("NO PRIVATE KEY FOUND!!");
    return;
  }

  const tokenAddres = process.env.TOKEN_ADDRESS;
  if (!tokenAddres) {
    console.log("NO TOKEN ADDRESS FOUND!!");
    return;
  }

  const wallet = new ethers.Wallet(ethers.utils.hexlify(`0x${key}`));
  const signer = wallet.connect(ethers.provider);
  const LotteryFactory = new Lottery__factory(signer);
  const LotteryContract = await LotteryFactory.deploy(
    "TK",
    "Ticket",
    10 ** 3,
    BigNumber.from(10).pow(18).mul(5),
    BigNumber.from(10).pow(18).mul(1)
  );
  await LotteryContract.deployed();

  console.log("Lottery Contract address:", LotteryContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
