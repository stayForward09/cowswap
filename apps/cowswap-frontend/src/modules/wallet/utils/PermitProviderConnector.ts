import { getContract } from '@cowprotocol/common-utils'
import { defaultAbiCoder, ParamType } from '@ethersproject/abi'
import { TypedDataField } from '@ethersproject/abstract-signer'
import type { Web3Provider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'

import { AbiItem, EIP712TypedData, ProviderConnector } from '@1inch/permit-signed-approvals-utils'
import { AbiInput } from 'web3-utils'

export class PermitProviderConnector implements ProviderConnector {
  constructor(private provider: Web3Provider, private walletSigner?: Wallet | undefined) {}

  contractEncodeABI(abi: AbiItem[], address: string | null, methodName: string, methodParams: unknown[]): string {
    const contract = getContract(address || '', abi, this.provider)

    return contract.interface.encodeFunctionData(methodName, methodParams)
  }

  signTypedData(_walletAddress: string, typedData: EIP712TypedData, _typedDataHash: string): Promise<string> {
    // Removes `EIP712Domain` as it's already part of EIP712 (see https://ethereum.stackexchange.com/a/151930/55204)
    // and EthersJS complains when a type is not needed (see https://github.com/ethers-io/ethers.js/discussions/4000)
    const types = Object.keys(typedData.types).reduce<Record<string, TypedDataField[]>>((acc, type) => {
      if (type !== 'EIP712Domain') {
        acc[type] = typedData.types[type]
      }
      return acc
    }, {})

    const signer = this.walletSigner || this.provider.getSigner()

    return signer._signTypedData(typedData.domain, types, typedData.message)
  }

  ethCall(contractAddress: string, callData: string): Promise<string> {
    return this.provider.call({
      to: contractAddress,
      data: callData,
    })
  }

  decodeABIParameter<T>(type: string, hex: string): T {
    return defaultAbiCoder.decode([type], hex)[0]
  }
  decodeABIParameters<T>(types: AbiInput[], hex: string): T {
    return defaultAbiCoder.decode(types as unknown as (ParamType | string)[], hex) as T
  }
}