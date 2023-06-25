export const transactionPayment = (
  subTotal: number,
  vTotal: number = 0,
  discount: number = 0,
  discountIva: number = 0,
) => {
  const commission = 3.4 / 100;
  const commissionConekta = 3;
  const iva = 16 / 100;

  subTotal = +(subTotal / 100).toFixed(2);
  discount = subTotal * commission + commissionConekta;
  discountIva = discount * iva;
  vTotal = subTotal - (discount + discountIva);

  return +vTotal.toFixed(2);
};
