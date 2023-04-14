import { Err, Ok, Result } from "ts-results";
import { SafeParseReturnType, z } from "zod";

export const OrderContact = z.object({
  email: z.nullable(z.string()),
  phone: z.nullable(z.string()),
});

const Address = z.object({
  address1: z.string(),
  address2: z.nullable(z.string()),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
});

export const Shop = z.object({
  shopId: z.number(),
  name: z.string(),
  address: Address,
});

const CustomerAddress = Address.extend({
  firstName: z.string(),
  lastName: z.string(),
});

export const OrderLineItem = z.object({
  // We might not want this...
  orderId: z.number(),

  /** The globally unique line item id number used by the API to lookup/reference a given line item. */
  lineItemId: z.number(),

  /** The price of the item before discounts have been applied in the shop currency. */
  price: z.number(),

  imageSrc: z.nullable(z.string()),

  /** The quantity of the item purchased in the order. */
  qty: z.number(),

  /** The item sku. */
  sku: z.string(),

  /** The title of the product. */
  // We want this to be most descriptive title that ideally includes product + variant/options
  // e.g. Hat Red Large
  // Ryan thinks this is variantTitle, not title or name
  title: z.string(),

  /** The name of the item's supplier. */
  shopId: z.number(),

  updatedAt: z.string(),

  // TODO: Fulfillment related stuff
  fulfillmentStatus: z.enum(["unfulfilled", "fulfilled"]),

  // TODO(ryanouellette): I'm pretty sure this isn't correctly handled at the moment. Review.
  // We take this from fulfillableQuantity? But that's set ahead of the order being fulfilled
  // or otherwise manipulated?
  qtyFulfilled: z.number(),
});

// This is the value returned from the api when calling for orders
// Accept: application/vnd+myti.order+v2.json
export const Order = z.object({
  /** The globally unique order id number used by Myti to identify the order */
  orderId: z.number(),

  // Should be the myti order number
  orderNumber: z.string(), // e.g. the Myti Order # '#1234-1'

  /**
   * The mailing address associated with the payment method. This address is an optional field
   * on orders that do not require a payment method.
   */
  billingAddress: z.nullable(CustomerAddress),

  // Drop for now, when we solve easy routes we'll have to sort this out
  // Which is this sprint, this sprint is logistics tech is ready
  // deliveryInstruction: z.string();

  /**
   * The mailing address to where the order will be shipped. This address is optional and will not be available on
   * orders that do not require shipping.
   */
  shippingAddress: z.nullable(CustomerAddress),

  /** Contact information for the customer that placed the order. */
  contact: OrderContact,

  /** The date and time (ISO 8601) when the order was created. */
  createdAt: z.string(),

  /** The total price of the order. Reflects changes to the order, e.g. refunds, discounts, et cetera. */
  price: z.number(),

  /** The subtotal price of the order. Reflects changes to the order, e.g. refunds, discounts, et cetera. */
  subtotal: z.number(),

  /** The total tax charged on the order. Reflects changes to the order, e.g. refunds, discounts, et cetera. */
  tax: z.number(),

  /** A list of line item objects, each containing information about an item in the order. */
  lineItems: z.array(OrderLineItem),

  // TODO(ryanouellette): We should perhaps opt to SHOUT_CASE enum literals where we can. Although, perhaps we should
  // just match shopify/big-commerce if they're consistent between them so that we're consistent throughout
  // at least to begin, before a new integration violates the practice? Discuss with ben@.
  status: z.enum(["placed", "cancelled", "out-for-delivery", "delivered"]),
});

// ===== BEGIN SUPPORTING CODECS =====
// i.e. non-entity codecs that support response processing, query payloads, etc.

// TODO(ryanouellette): Refine this structure and organization. How should these co-exist with the entity
// codecs? Naming conventions? All that.

// TODO(ryanouellette): @types This is kinda gross, but likely gets some of a solution handed to it if we try
// tRPC? Maybe? Ugh. So many things to establish.
export const OrdersResponse = z.object({
  orders: z.array(Order),
  shops: z.array(Shop),
});

export const OrdersResponsePayload = z.object({
  data: OrdersResponse,
});

// ===== END SUPPORTING CODECS =====
// TODO(ryanouellette): @codeshare All of the below should be removed/moved once code sharing is solved. These decoders/encoders
// are identities that should be available via GenericCoders. asResult is in zodutil but copied here.

/**
 * asResult is a convenience function to convert a zod @{type SafeParseReturnType}
 * to a @{type Result}.
 *
 * @param parseReturn - The parse result from a call to a zod @{link ZodType.safeParse}.
 * @returns - The @{type SafeParseReturnType} repackaged as a @{type Result}.
 */
export function asResult<I, O>(parseReturn: SafeParseReturnType<I, O>): Result<O, Error> {
  if (parseReturn.success) {
    return Ok(parseReturn.data);
  }
  return Err(parseReturn.error);
}

export function decode<T extends z.ZodTypeAny>(wire: unknown, schema: T): z.output<T> {
  return schema.parse(wire);
}

export function safeDecode<T extends z.ZodTypeAny>(wire: unknown, schema: T): Result<z.output<T>, Error> {
  return asResult(schema.safeParse(wire));
}

export function encode<T extends z.ZodTypeAny>(system: z.input<T>, schema: T): z.output<T> {
  return schema.parse(system);
}

export function safeEncode<T extends z.ZodTypeAny>(system: z.input<T>, schema: T): z.output<T> {
  return asResult(schema.safeParse(system));
}
