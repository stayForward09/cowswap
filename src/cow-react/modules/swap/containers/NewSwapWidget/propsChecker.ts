import { SwapFormProps } from '@cow/modules/swap/containers/NewSwapWidget/types'
import { PriceImpact } from 'hooks/usePriceImpact'
import { Fraction } from '@uniswap/sdk-core'
import { ReceiveAmountInfo } from '@cow/modules/swap/helpers/tradeReceiveAmount'
import { CurrencyInfo } from '@cow/common/pure/CurrencyInputPanel/types'

function isFractionEqual(prev?: Fraction | null, next?: Fraction | null): boolean {
  return prev && next ? prev.equalTo(next) : prev === next
}

function isReceiveAmountInfoEqual(prev: ReceiveAmountInfo | null, next: ReceiveAmountInfo | null): boolean {
  if (!prev || !next) {
    return prev === next
  }

  return (
    prev.feeAmount === next.feeAmount &&
    prev.amountBeforeFees === next.amountBeforeFees &&
    isFractionEqual(prev.amountAfterFeesRaw, next.amountAfterFeesRaw) &&
    prev.amountAfterFees === next.amountAfterFees
  )
}

function isCurrencyInfoEqual(prev: CurrencyInfo, next: CurrencyInfo): boolean {
  const isCurrencyEqual =
    prev.currency && next.currency ? prev.currency.equals(next.currency) : prev.currency === next.currency
  const isBalanceEqual = isFractionEqual(prev.balance, next.balance)
  const isFiatAmountEqual = isFractionEqual(prev.fiatAmount, next.fiatAmount)
  const isRawAmountEqual = isFractionEqual(prev.rawAmount, next.rawAmount)
  const isViewAmountEqual = prev.viewAmount === next.viewAmount

  return (
    isCurrencyEqual &&
    isBalanceEqual &&
    isFiatAmountEqual &&
    isRawAmountEqual &&
    isViewAmountEqual &&
    isReceiveAmountInfoEqual(prev.receiveAmountInfo, next.receiveAmountInfo)
  )
}

function isPriceImpactEqual(prev: PriceImpact, next: PriceImpact): boolean {
  return (
    prev.loading === next.loading && prev.error === next.error && isFractionEqual(prev.priceImpact, next.priceImpact)
  )
}

export function swapPagePropsChecker(prev: SwapFormProps, next: SwapFormProps): boolean {
  return (
    prev.allowedSlippage.equalTo(next.allowedSlippage) &&
    prev.showRecipientControls === next.showRecipientControls &&
    prev.recipient === next.recipient &&
    prev.isTradePriceUpdating === next.isTradePriceUpdating &&
    prev.allowsOffchainSigning === next.allowsOffchainSigning &&
    genericPropsChecker(prev.subsidyAndBalance, next.subsidyAndBalance) &&
    isCurrencyInfoEqual(prev.inputCurrencyInfo, next.inputCurrencyInfo) &&
    isCurrencyInfoEqual(prev.outputCurrencyInfo, next.outputCurrencyInfo) &&
    isPriceImpactEqual(prev.priceImpactParams, next.priceImpactParams)
  )
}

export function genericPropsChecker(prev: any, next: any): boolean {
  return JSON.stringify(prev) === JSON.stringify(next)
}
