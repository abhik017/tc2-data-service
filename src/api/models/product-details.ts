export default interface ProductDetails {
    ITEM_NAME: string, // Unique Key
    mrp: number,
    defaultDiscountInPct: number,
    commissionInPct: number,
    unit: string,
    updatedAt: number,
    createdAt: number,
    createdBy: string
}