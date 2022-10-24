import LOTTERY_CONTRACT_ABI from "../contracts/Lottery.json";
import type { Lottery as LOTTERY_CONTRACT } from "../contracts/types";
import useContract from "./useContract";

const CONTRACT_ADDRESS = "0xB599E0aea42B919d56EB1eCE8351c41dfb961a52";

export default function useMyContract() {
  return useContract<LOTTERY_CONTRACT>(CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI);
}