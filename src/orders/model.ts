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
  order_number: string; // should only be on order
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
