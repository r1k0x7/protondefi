import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useState, useCallback } from 'react'
import { PROTOCOL_ABI, PROTOCOL_ADDRESS } from '../utils/constants'

export function useProtocol() {
  const { address } = useAccount()

  // Read functions
  const { data: accountHealth } = useContractRead({
    address: PROTOCOL_ADDRESS,
    abi: PROTOCOL_ABI,
    functionName: 'getAccountHealth',
    args: address ? [address] : undefined,
    enabled: !!address,
  })

  const { data: tokenList } = useContractRead({
    address: PROTOCOL_ADDRESS,
    abi: PROTOCOL_ABI,
    functionName: 'getTokenList',
    enabled: !!address,
  })

  // Write functions
  const { config: depositConfig } = usePrepareContractWrite({
    address: PROTOCOL_ADDRESS,
    abi: PROTOCOL_ABI,
    functionName: 'deposit',
  })

  const { write: deposit, isLoading: isDepositing } = useContractWrite(depositConfig)

  const { config: withdrawConfig } = usePrepareContractWrite({
    address: PROTOCOL_ADDRESS,
    abi: PROTOCOL_ABI,
    functionName: 'withdraw',
  })

  const { write: withdraw, isLoading: isWithdrawing } = useContractWrite(withdrawConfig)

  const { config: borrowConfig } = usePrepareContractWrite({
    address: PROTOCOL_ADDRESS,
    abi: PROTOCOL_ABI,
    functionName: 'borrow',
  })

  const { write: borrow, isLoading: isBorrowing } = useContractWrite(borrowConfig)

  const { config: repayConfig } = usePrepareContractWrite({
    address: PROTOCOL_ADDRESS,
    abi: PROTOCOL_ABI,
    functionName: 'repay',
  })

  const { write: repay, isLoading: isRepaying } = useContractWrite(repayConfig)

  return {
    accountHealth,
    tokenList,
    deposit,
    withdraw,
    borrow,
    repay,
    isDepositing,
    isWithdrawing,
    isBorrowing,
    isRepaying,
  }
}
  
