/**
 * Single pricing engine. Used by the public catalogue (to display pack
 * prices) and by checkout (to freeze an order), so the two can never disagree.
 * All arithmetic is done in integer minor units (paise), rounded once per step.
 */
export const toMinor = (rupees: number | string): number =>
  Math.round(Number(rupees) * 100);
export const fromMinor = (minor: number): number => minor / 100;

export interface QuoteInput {
  unitPrice: number | string;
  quantity: number;
  packDiscountPercent: number | string;
  addonPrices: Array<number | string>;
  promoPercent: number | string;
  taxRate: number;
}

export interface Quote {
  unitPrice: number;
  quantity: number;
  listPrice: number;
  packDiscountPercent: number;
  packDiscount: number;
  packTotal: number;
  addonsTotal: number;
  promoPercent: number;
  promoDiscount: number;
  subtotal: number;
  taxable: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  totalMinor: number;
}

export function computeQuote(i: QuoteInput): Quote {
  const unit = toMinor(i.unitPrice);
  const qty = Math.max(1, Math.floor(i.quantity));
  const packPct = Number(i.packDiscountPercent) || 0;
  const promoPct = Number(i.promoPercent) || 0;

  const list = unit * qty;
  const packTotal = Math.round(list * (1 - packPct / 100));
  const packDiscount = list - packTotal;
  const addons = i.addonPrices.reduce<number>((s, p) => s + toMinor(p), 0);
  const subtotal = packTotal + addons;
  const promoDiscount = Math.round(subtotal * (promoPct / 100));
  const taxable = subtotal - promoDiscount;
  const tax = Math.round(taxable * i.taxRate);
  const total = taxable + tax;

  return {
    unitPrice: fromMinor(unit),
    quantity: qty,
    listPrice: fromMinor(list),
    packDiscountPercent: packPct,
    packDiscount: fromMinor(packDiscount),
    packTotal: fromMinor(packTotal),
    addonsTotal: fromMinor(addons),
    promoPercent: promoPct,
    promoDiscount: fromMinor(promoDiscount),
    subtotal: fromMinor(subtotal),
    taxable: fromMinor(taxable),
    taxRate: i.taxRate,
    taxAmount: fromMinor(tax),
    total: fromMinor(total),
    totalMinor: total,
  };
}
