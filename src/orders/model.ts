export type OrderContact = {
  email: string;
  phone: string;
};

// This is the value returned from the api when calling for orders
// Accept: application/vnd+myti.order+v2.json
export type Order = {
  /** The globally unique order id number used by Myti to identify the order */
  orderId: number;

  // Should be the myti order number
  orderNumber: string; // e.g. the Myti Order # '#1234-1'

  /**
   * The mailing address associated with the payment method. This address is an optional field
   * on orders that do not require a payment method. Missing from payload when there is no billing
   * address.
   */
  billingAddress: CustomerAddress | null;

  // Drop for now, when we solve easy routes we'll have to sort this out
  // Which is this sprint, this spritn is logistics tech is ready
  // deliveryInstruction: string;

  /**
   * The mailing address to where the order will be shipped. This address is optional and will not be available on
   * orders that do not require shipping. Missing from payload when there is no shipping address.
   */
  shippingAddress: CustomerAddress;

  contact: OrderContact;

  /** The date and time (ISO 8601) when the order was created. */
  createdAt: string;

  // TODO(xisforxerxes): @localization We may need to grab duties from orders if we ever aim to support selling
  // outside the US.

  /**
   * The current total price of the order in the shop currency. The value of this field reflects order edits,
   * returns and refunds.
   *
   * TODO(xisforxerxes): @localization This may be insufficient if we ever aim to support selling outside the US.
   */
  // these will be number.toFixed(2) * 100 (10.50 -> 1050)
  price: number;
  subtotal: number;
  tax: number;

  // still need to figure out statusr elated stuff, possibly all on the line item

  /** A list of line item objects, each containing information about an item in the order. */
  lineItems: LineItem[];
};

export type CustomerAddress = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  stateCode: string;
  zip: string;
};

export type LineItem = {
  // We might not want this...
  orderId: number;

  /** The globally unique line item id number used by the API to lookup/reference a given line item. */
  lineItemId: number;

  /**
   * The price of the item before discounts have been applied in the shop currency.
   *
   * TODO(xisforxerxes): @localization This may be insufficient if we ever aim to support selling outside the US,
   * i.e. when shop_currency != presentment_currency. We would need to also capture presentment values from the
   * price_set.
   */
  price: string;

  imageSrc: string;

  /** The quantity of the item purchased in the order. */
  qty: number;

  /** The item sku. */
  sku: string;

  /** The title of the product. */
  // We want this to be most descriptive title that ideally includes product + variant/options
  // e.g. Hat Red Large
  // Ryan thinks this is variantTitle, not title or name
  title: string;

  /** The name of the item's supplier. */
  shopId: number;

  // TODO: Fulfillment related stuff
  updatedAt: string;
};

export type Shop = {
  shopId: number;
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  stateCode: string;
  zip: string;
};
