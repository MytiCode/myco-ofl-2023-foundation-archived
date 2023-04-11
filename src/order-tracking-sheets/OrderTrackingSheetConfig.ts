export type OrderTrackingSheetLabel = "Orders" | "Line Items";

export class OrderTrackingSheetConfig {
  ORDER_COLUMNS = [
    { headerLabel: "Order #", name: "orderNumber" },
    { headerLabel: "Shop Name ", name: "shopName" },
    { headerLabel: "Fulfillment Status", name: "fulfillmentStatus" },
    { headerLabel: "Picked Up ", name: "pickedUp" },
    { headerLabel: "At Depot ", name: "atDepot" },
    { headerLabel: "QA ", name: "qa" },
    { headerLabel: "In Delivery Route ", name: "inDeliveryRoute" },
    { headerLabel: "Ready for Delivery ", name: "readyForDelivery" },
    { headerLabel: "Out for Delivery ", name: "outForDelivery" },
    { headerLabel: "Delivered ", name: "delivered" },
    { headerLabel: "Action Needed ", name: "actionNeeded" },
    { headerLabel: "Notes ", name: "notes" },
  ];

  LINE_ITEM_COLUMNS = [
    { headerLabel: "Order #", name: "orderNumber" },
    { headerLabel: "Item Name", name: "title" },
    { headerLabel: "QTY Ordered", name: "qty" },
    { headerLabel: "QTY Fulfilled", name: "qtyFulfilled" },
    { headerLabel: "Line Item ID", name: "lineItemId" },
    { headerLabel: "Action Needed", name: "actionNeeded" },
    { headerLabel: "Notes", name: "notes" },
  ];

  get sheets(): Array<{
    label: OrderTrackingSheetLabel;
    headers: string[];
    columnNames: string[];
  }> {
    return [
      {
        label: "Orders",
        headers: this.ORDER_COLUMNS.map((c) => c.headerLabel),
        columnNames: this.ORDER_COLUMNS.map((c) => c.name),
      },
      {
        label: "Line Items",
        headers: this.LINE_ITEM_COLUMNS.map((c) => c.headerLabel),
        columnNames: this.LINE_ITEM_COLUMNS.map((c) => c.name),
      },
    ];
  }

  forSheet(label: string) {
    const config = this.sheets.find((c) => c.label === label);
    if (!config) {
      throw new Error(`Could not find config for sheet with label "${label}"`);
    }

    return config;
  }
}
