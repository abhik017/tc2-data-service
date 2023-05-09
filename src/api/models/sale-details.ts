export default interface SaleDetails {
    itemName: string,
    ID: number, // Unique Id
    quantity: number,
    discountInPct: number,
    commissionInPct: number,
    totalAmount: number,
    netAmountRecieved: number,
    netAmountPending: number,
    customerName: string,
    customerPhone: string,
    createdAt: number
}