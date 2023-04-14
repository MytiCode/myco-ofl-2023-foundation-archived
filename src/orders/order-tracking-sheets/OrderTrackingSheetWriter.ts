import * as XLSX from "xlsx";

import {
  OrderTrackingSheetConfig,
  OrderTrackingSheetLabel,
} from "./OrderTrackingSheetConfig";

export class OrderTrackingSheetWriter {
  constructor(
    private config: OrderTrackingSheetConfig = new OrderTrackingSheetConfig()
  ) {}

  // TODO: Better types
  write({
    orders,
    lineItems,
    filename,
  }: {
    orders: any[];
    lineItems: any[];
    filename: string;
  }) {
    const workbook = XLSX.utils.book_new();

    const rowsByLabel = new Map<OrderTrackingSheetLabel, any[]>([
      ["Orders", orders],
      ["Line Items", lineItems],
    ]);
    this.config.sheets.forEach(({ label, headers }) => {
      const rows = rowsByLabel.get(label);
      if (!rows) throw new Error(`Could not find rows for ${label}`);
      const sheet = this.buildSheet({ rows, headers });
      XLSX.utils.book_append_sheet(workbook, sheet, label);
    });

    XLSX.writeFile(workbook, filename);
  }

  private buildSheet({ rows, headers }: { rows: any[]; headers: string[] }) {
    rows.forEach((row) => {
      headers.forEach((_header, index) => {
        if (!(index in row)) {
          row[index] = "";
        } else {
          row[index] = String(row[index]);
        }
      });
      if (row.length !== headers.length) {
        throw new Error(
          `row must be same length as headers. Expected ${headers.length} cells but got ${row.length}`
        );
      }
    });

    return XLSX.utils.aoa_to_sheet([headers, ...rows]);
  }
}
