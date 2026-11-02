/**
 * CurrencyInput reports both the localized editing string (`value`) and the
 * parsed number (`float`). Locales that use a comma decimal separator (pt-BR,
 * fr-FR, de-DE, …) keep `value` as `"14,13"`, which `Number("14,13")` cannot
 * parse. The form must keep the string for typing (a trailing comma would
 * otherwise disappear) and the float for validation and the create payload.
 */
export type GiftCardAmountValue = {
  display: string
  amount: number | null
}

export type GiftCardCurrencyInputValues = {
  value?: string
  float: number | null
}

export function giftCardAmountFromCurrencyValues(
  values?: GiftCardCurrencyInputValues
): GiftCardAmountValue {
  const display = values?.value ?? ""
  if (typeof values?.float === "number" && Number.isFinite(values.float)) {
    return { display, amount: values.float }
  }

  return { display, amount: null }
}
