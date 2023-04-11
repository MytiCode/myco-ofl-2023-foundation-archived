import Layout from "@/components/Layout";
import { useEffect } from "react";
import * as XLSX from "xlsx";

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

  get sheets(): Array<{ label: OrderTrackingSheetLabel, headers: string[], columnNames: string[] }> {
    return [
      { label: 'Orders', headers: this.ORDER_COLUMNS.map(c => c.headerLabel), columnNames: this.ORDER_COLUMNS.map(c => c.name) },
      { label: 'Line Items', headers: this.LINE_ITEM_COLUMNS.map(c => c.headerLabel), columnNames: this.LINE_ITEM_COLUMNS.map(c => c.name) }
    ];
  }

  forSheet(label: string) {
    const config = this.sheets.find(c => c.label === label);
    if (!config) {
      throw new Error(`Could not find config for sheet with label "${label}"`);
    }

    return config;
  }

}

class OrderTrackingSheetWriter {

  constructor(private config: OrderTrackingSheetConfig = new OrderTrackingSheetConfig) {}

  // TODO: Better types
  write({ orders, lineItems, filename }: { orders: any[], lineItems: any[], filename: string }) {
    const workbook = XLSX.utils.book_new();

    const rowsByLabel = new Map<OrderTrackingSheetLabel, any[]>([
      ["Orders", orders],
      ["Line Items", lineItems]
    ]);
    this.config.sheets.forEach(({ label, headers }) => {
      const rows = rowsByLabel.get(label);
      if (!rows) throw new Error(`Could not find rows for ${label}`);
      const sheet = this.buildSheet({ rows, headers });
      XLSX.utils.book_append_sheet(workbook, sheet, label);
    });

    XLSX.writeFile(workbook, filename);
  }
  
  private buildSheet({ rows, headers }: { rows: any[], headers: string[] }) {
    rows.forEach(row => {
      headers.forEach((_header, index) => {
        if (!(index in row)) {
          row[index] = "";
        }
      });
      if (row.length !== headers.length) {
        throw new Error(`row must be same length as headers. Expected ${headers.length} cells but got ${row.length}`);
      }
    });

    return XLSX.utils.aoa_to_sheet([
      headers,
      ...rows
    ]);
  }
}

let didInit = false;

export default function OrderTrackingSheetsPage() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;

      // TODO: Filename "Order Tracking Sheet – {START_DATE}-{END_DATE}"
      new OrderTrackingSheetWriter().write({
        filename: 'Order Tracking Sheet.xlsx',
        orders: [
          ["#1226-2", "Homeport", "unfulfilled"],
        ],
        lineItems: [
          ["#1226-2", "Auric Blends Perfume Oil - Moonlight", "1", "1", "11352135467177"],
        ]
      });
    }
  }, []);

  return (
    <Layout title="Order Tracking Sheets">
      <p>I am the sheet!</p>
    </Layout>
  );
}