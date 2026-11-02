import { giftCardAmountFromCurrencyValues } from "./amount"
import { GiftCardCreateSchema } from "./schema"

describe("giftCardAmountFromCurrencyValues", () => {
  it("keeps the localized display string and the parsed float", () => {
    expect(
      giftCardAmountFromCurrencyValues({ value: "14,13", float: 14.13 })
    ).toEqual({
      display: "14,13",
      amount: 14.13,
    })
  })

  it("keeps a trailing decimal separator so the field stays editable", () => {
    expect(
      giftCardAmountFromCurrencyValues({ value: "14,", float: 14 })
    ).toEqual({
      display: "14,",
      amount: 14,
    })
  })

  it("returns a null amount when CurrencyInput has not parsed a number", () => {
    expect(
      giftCardAmountFromCurrencyValues({ value: "", float: null })
    ).toEqual({
      display: "",
      amount: null,
    })
    expect(
      giftCardAmountFromCurrencyValues({ value: "abc", float: null })
    ).toEqual({
      display: "abc",
      amount: null,
    })
  })
})

describe("GiftCardCreateSchema", () => {
  it("rejects the localized string CurrencyInput currently stores on change", () => {
    const result = GiftCardCreateSchema.safeParse({
      value: "14,13",
      currency_code: "brl",
    })

    expect(result.success).toBe(false)
  })

  it("accepts a comma-decimal CurrencyInput payload used in pt-BR and similar locales", () => {
    const value = giftCardAmountFromCurrencyValues({
      value: "14,13",
      float: 14.13,
    })
    const result = GiftCardCreateSchema.safeParse({
      value,
      currency_code: "brl",
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      throw new Error("expected gift card amount 14,13 to parse")
    }
    expect(result.data.value.amount).toBe(14.13)
    expect(result.data.currency_code).toBe("brl")
  })

  it("rejects an empty amount", () => {
    const result = GiftCardCreateSchema.safeParse({
      value: giftCardAmountFromCurrencyValues({ value: "", float: null }),
      currency_code: "brl",
    })

    expect(result.success).toBe(false)
  })
})
