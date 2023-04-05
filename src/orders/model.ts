export type LineItem = {
  line_item_id: number;
  image_src: string;
  name: string;
  handle: string;
  sku: string;
  line_item_updated_at: string;
  shipping_last_name: string;
  shipping_address1: string;
  shipping_address2?: string;
  shipping_zip: string;
  /**
   * TODO: This is not a line item field
   * It was on line item b/c in the By-Shop view (MytiView)
   * There was no concept of orders
   * Which is going to evolve into the pickup view
   * Perhaps we just represent this as a shop having orders
   * But the orders only have the line items from that shop
   * Or else we put an order property on the line item with this but... probably better to keep order.line_items
   */
  order_number: string;
  created_at: string;
  qty: number;
};

export type Shop = {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  line_items: LineItem[];
};

export type Order = {
  id: number;
  order_number: string;
  line_items: LineItem[];
  created_at: string;
  shipping_address1: string;
  shipping_address2: string;
  shipping_city: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_zip: string;
};
