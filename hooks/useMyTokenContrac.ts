import { useEffect, useState } from "react";
import LOTTERY_TOKEN_ABI from "../contracts/ERC20.json";
import type { ERC20 as LOTTERY_TOKEN_CONTRACT } from "../contracts/types";
import useContract from "./useContract";

export default function useMyTokenContract(tokenAddress) {
    return useContract<LOTTERY_TOKEN_CONTRACT>(tokenAddress, LOTTERY_TOKEN_ABI);
}