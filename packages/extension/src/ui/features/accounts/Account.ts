import { Abi, Contract, ProviderInterface, number, stark } from "starknet"

import ArgentCompiledContractAbi from "../../../abis/ArgentAccount.json"
import ProxyCompiledContractAbi from "../../../abis/Proxy.json"
import { Network, getNetwork, getProvider } from "../../../shared/network"
import {
  ArgentAccountType,
  BaseWalletAccount,
  WalletAccount,
  WalletAccountSigner,
} from "../../../shared/wallet.model"
import { getAccountIdentifier } from "../../../shared/wallet.service"
import {
  createNewAccount,
  deployNewAccount,
} from "../../services/backgroundAccounts"

export interface AccountConstructorProps {
  address: string
  network: Network
  signer: WalletAccountSigner
  type: ArgentAccountType
  deployTransaction?: string
  hidden?: boolean
  needsDeploy?: boolean
  contract?: Contract
}

export class Account {
  address: string
  network: Network
  networkId: string
  signer: WalletAccountSigner
  type: ArgentAccountType
  deployTransaction?: string
  contract: Contract
  proxyContract: Contract
  provider: ProviderInterface
  hidden?: boolean
  needsDeploy?: boolean

  constructor({
    address,
    network,
    signer,
    type,
    deployTransaction,
    hidden,
    needsDeploy = false,
    contract,
  }: AccountConstructorProps) {
    this.address = address
    this.network = network
    this.networkId = network.id
    this.signer = signer
    this.hidden = hidden
    this.deployTransaction = deployTransaction
    this.needsDeploy = needsDeploy
    this.type = type
    this.provider = getProvider(network)
    this.contract =
      contract ??
      new Contract(ArgentCompiledContractAbi as Abi, address, this.provider)
    this.proxyContract = new Contract(
      ProxyCompiledContractAbi as Abi,
      address,
      this.provider,
    )

    const key = this.getDeployTransactionStorageKey()
    if (deployTransaction) {
      localStorage.setItem(key, deployTransaction)
    } else if (localStorage.getItem(key)) {
      this.deployTransaction = localStorage.getItem(key) ?? undefined
    }
  }

  public getDeployTransactionStorageKey(): string {
    const key = `deployTransaction:${getAccountIdentifier(this)}`
    return key
  }

  public updateDeployTx(deployTransaction: string) {
    const key = this.getDeployTransactionStorageKey()
    this.deployTransaction = deployTransaction
    localStorage.setItem(key, deployTransaction)
  }

  public completeDeployTx(): void {
    const key = this.getDeployTransactionStorageKey()
    localStorage.removeItem(key)
    this.deployTransaction = undefined
  }

  public async getCurrentNonce(): Promise<string> {
    const { nonce } = await this.contract.call("get_nonce")
    return nonce.toString()
  }

  public async getCurrentImplementation(): Promise<string | undefined> {
    if (this.needsDeploy) {
      return this.type === "argent"
        ? this.network.accountClassHash?.argentAccount
        : this.network.accountClassHash?.argentPluginAccount
    }

    const { implementation } = await this.proxyContract.call(
      "get_implementation",
    )
    return stark.makeAddress(number.toHex(implementation))
  }

  public static async create(networkId: string): Promise<Account> {
    const result = await createNewAccount(networkId)
    if ("error" in result) {
      throw new Error(result.error)
    }

    const network = await getNetwork(networkId)

    if (!network) {
      throw new Error(`Network ${networkId} not found`)
    }

    return new Account({
      address: result.account.address,
      network,
      signer: result.account.signer,
      type: result.account.type,
      needsDeploy: result.account.needsDeploy,
    })
  }

  // Currently not used anywhere. Might be useful in the future
  public async deploy(): Promise<Account> {
    if (!this.needsDeploy) {
      throw new Error("Account already deployed")
    }

    const result = await deployNewAccount(this)
    if ("error" in result) {
      throw new Error(result.error)
    }

    this.updateDeployTx(result.txHash)

    return this
  }

  public toWalletAccount(): WalletAccount {
    const { networkId, address, network, signer, type, needsDeploy } = this
    return {
      networkId,
      address,
      network,
      signer,
      type,
      needsDeploy,
    }
  }

  public toBaseWalletAccount(): BaseWalletAccount {
    const { networkId, address } = this
    return {
      networkId,
      address,
    }
  }
}
