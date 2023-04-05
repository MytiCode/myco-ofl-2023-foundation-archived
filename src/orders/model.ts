/**
 * How do we structure api calls knowing we need shop data?
 * Just return { orders, shops } probably for now
 * No reason to stand up a separate shops api just for this 1 use case yet
 */
export type LineItem = {
  line_item_id: number;
  /**
   * image_src... sigh
   * This is a product field (collection of images)
   * Could be the default product image
   * But there can also be variant-specific images
   * Which would be more accurate picture of the item ordered
   * None of these are on line item
   * And also the url can end up disappearing if the product is archived
   * And we need to handle resizing
   * I think we should just a single image_src property which is our most representative image
   * For now it might just be the default product image or maybe its the variant
   * Also likely inclkudes a query string already to ensure the image isnt too massive (this makes the sheet PDFs really big)
   * Eventually we may want to ensure this url remains live even if the product is archived
   * Though we mostly think that problem will go away with FlxP cos we wont archive the product, just hide it due to low qty, still need to investigate
   * Basically there is a bunch of complexity here and id like to keep the client dumb for now at least
   */
  image_src: string;
  name: string;
  /**
   * Handle is only used to link to the product page on shop.myti
   * Its not technically a line item field (its a product field)
   * Probably better off to embed a product url or something than bleed handle here
   */
  handle: string;
  sku: string;
  line_item_updated_at: string;
  // Doesn't really belong here...
  // In both views we are ending up needing to know the line items order and shop info
  shop_name: string;

  /**
   * All the shipping fields are order fields, not line item fields
   */
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address1: string;
  shipping_address2?: string;
  shipping_city: string;
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

  // Where does the qty fulfilled go?
  qty: number;

  /**
   * If we're going to filter in the client we will likely need status(es) here and on order
   * What statuses?
   * Single status?
   * Status history?
   * Separate status for
   * Order level stauts and line item status?
   * Line Item statuses:
   *  Unfulfilled
   *  Ready for Pickup (fulfilled)
   *  Partially Ready for Pickup (partially fulfilled)
   *  At Myti Depot (no way to get into this status right now, prob other internal statuses in the future, like QA'd or something)
   *  Delivered
   *  Cancelled?
   * Order Statuses:
   *  Unfulfilled
   *  Ready for Pickup (fulfilled)
   *  Partially Ready for Pickup (partially fulfilled)
   *  At Myti Depot (no way to get into this status right now, prob other internal statuses in the future, like QA'd or something)
   *  Delivered
   *  Cancelled?
   *  Are these always calculated based line item status?
   * Do we separate fulfillment status from delivery status?
   *  When does fulfillment status end and delivery status begin?
   *  Ready for Pickup (or partially ready) would be the terminal fulfillment status
   *      Though maybe cancelled in the future
   *  Delivery status then starts with 'Picked Up' or something
   * Seems like a single status enum is the way to go, fulfillment -> delivery is a pipeline of statuses
   */
};

export type Shop = {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;

  /**
   * This relationship doesn't really make sense
   * We need some way to key from line item to shop
   * Should probably treat shop as a side-loaded separate resource
   * Line items could have a shop id that we use to look up the shop
   * Maybe for the view we end up copying shop onto line item to make the rendeirng convenient
   */
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
