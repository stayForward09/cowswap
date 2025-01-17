import { LONG_PRECISION } from '@cowprotocol/common-const'
import { FeatureFlag, formatTokenAmount, FractionUtils } from '@cowprotocol/common-utils'
import { UI } from '../../enum'
import styled from 'styled-components'
import { FractionLike, Nullish } from '../../types'
import { TokenSymbol, TokenSymbolProps } from '../TokenSymbol'
import { AMOUNTS_FORMATTING_FEATURE_FLAG } from '../../consts'

export const Wrapper = styled.span<{ highlight: boolean; lowVolumeWarning?: boolean }>`
  background: ${({ lowVolumeWarning, highlight }) =>
    lowVolumeWarning || highlight ? `var(${UI.COLOR_ALERT_BG})` : ''};
  color: ${({ lowVolumeWarning, highlight }) =>
    lowVolumeWarning || highlight ? `var(${UI.COLOR_ALERT_TEXT})` : 'inherit'};
  border-radius: 2px;
  word-break: break-word;
`

export const SymbolElement = styled.span<{ opacitySymbol?: boolean }>`
  color: inherit;
  opacity: ${({ opacitySymbol }) => (opacitySymbol ? 0.7 : 1)};
`

export interface TokenAmountProps {
  amount: Nullish<FractionLike>
  defaultValue?: string
  tokenSymbol?: TokenSymbolProps['token']
  className?: string
  hideTokenSymbol?: boolean
  round?: boolean
  opacitySymbol?: boolean
}

const highlight = !!FeatureFlag.get(AMOUNTS_FORMATTING_FEATURE_FLAG)

export function TokenAmount({
  amount,
  defaultValue,
  className,
  tokenSymbol,
  round,
  hideTokenSymbol,
  opacitySymbol,
}: TokenAmountProps) {
  const title =
    FractionUtils.fractionLikeToExactString(amount, LONG_PRECISION) + (tokenSymbol ? ` ${tokenSymbol.symbol}` : '')

  if (!amount) return null

  const tokenSymbolElement =
    hideTokenSymbol || !tokenSymbol ? null : (
      <>
        {' '}
        <TokenSymbol token={tokenSymbol} />
      </>
    )

  const roundedAmount = round ? FractionUtils.round(amount) : amount
  return (
    <Wrapper title={title} className={className} highlight={highlight}>
      {formatTokenAmount(roundedAmount) || defaultValue}
      <SymbolElement opacitySymbol={opacitySymbol}>{tokenSymbolElement}</SymbolElement>
    </Wrapper>
  )
}
