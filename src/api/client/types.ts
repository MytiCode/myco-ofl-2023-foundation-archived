import { z } from "zod";
import * as MycoCodecs from "./codecs";

export type Shop = z.output<typeof MycoCodecs.Shop>;
export type OrderContact = z.output<typeof MycoCodecs.OrderContact>;
export type OrderLineItem = z.output<typeof MycoCodecs.OrderLineItem>;
export type Order = z.output<typeof MycoCodecs.Order>;
export type OrdersResponse = z.output<typeof MycoCodecs.OrdersResponse>;
