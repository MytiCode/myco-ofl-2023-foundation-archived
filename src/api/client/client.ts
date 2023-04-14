import axios, { AxiosResponse } from "axios";
import { Err, Ok, Result } from "ts-results";
import * as MycoCodecs from "./codecs";
import * as MycoTypes from "./types";

// TODO(ryanouellette): @codeshare Should be imported from util.
/** ResultPromise is a convenience type alias for a type commonly used throughout the application. */
export type ResultPromise<T> = Promise<Result<T, Error>>;

// TODO(ryanouellette): @codeshare Figure out how to fold this. Borrowed from MytiError.fromCaught. Not sure
// if we plan to share MytiError, or whatever next iteration of it between services and webapp.
function errorFromCaught(caught: unknown): Error {
  let error: Error;
  if (!(caught instanceof Error)) {
    if (typeof caught === "string") {
      error = new Error(caught);
    } else {
      error = new Error(
        `caught unexpected error, its dump is: ${JSON.stringify(caught)}`
      );
    }
  } else {
    error = caught;
  }
  return error;
}

export class MycoClientConfig {
  constructor(public readonly apiUrl: string) {}
}

export class MycoClient {
  constructor(private config: MycoClientConfig) {}

  apiPath(path: string): string {
    // TODO(benglass): Normalize path to start with '/', or throw if it doesnt
    // TODO(benglass): Probably also normalize apiPath as well
    return this.config.apiUrl + path;
  }

  // TODO(benglass): @codeshare Why do we get this error in web trying to use ResultPromise?
  // Type 'ResultPromise' is not a valid async function return type in ES5/ES3
  // because it does not refer to a Promise-compatible constructor value.ts(1055)
  // async getOrders(): ResultPromise<MycoTypes.OrdersResponse> {
  async getOrders(): Promise<Result<MycoTypes.OrdersResponse, Error>> {
    let encoded: AxiosResponse;
    try {
      encoded = await axios.get(this.apiPath("/orders"));
    } catch (e) {
      return Err(errorFromCaught(e));
    }

    const decodeResult = MycoCodecs.safeDecode(
      encoded,
      MycoCodecs.OrdersResponsePayload
    );
    if (decodeResult.err) {
      return decodeResult;
    }

    const decoded = decodeResult.val;
    const ordersResponse = decoded.data;
    return Ok(ordersResponse);
  }
}
