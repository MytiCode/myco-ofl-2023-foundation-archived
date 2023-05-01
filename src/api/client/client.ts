import axios, { AxiosResponse } from "axios";
import { Err, Ok, Result } from "ts-results";
import * as MycoCodecs from "./codecs";
import * as MycoTypes from "./types";

// TODO(ryanouellette): @codeshare Figure out how to fold this. Borrowed from MytiError.fromCaught. Not sure
// if we plan to share MytiError, or whatever next iteration of it between services and webapp.
function errorFromCaught(caught: unknown): Error {
  let error: Error;
  if (!(caught instanceof Error)) {
    if (typeof caught === "string") {
      error = new Error(caught);
    } else {
      error = new Error(`caught unexpected error, its dump is: ${JSON.stringify(caught)}`);
    }
  } else {
    error = caught;
  }
  return error;
}

export class MycoClientConfig {
  // TODO(benglass): Make accessToken required?
  // Its not required right now to allow testing  NOT sending it, this might be a bad reason
  constructor(public readonly apiUrl: string, public readonly accessToken?: string) {}
}

export class MycoClient {
  constructor(private config: MycoClientConfig) {}

  apiPath(path: string): string {
    return this.config.apiUrl + path;
  }

  private async request(url: string): Promise<Result<AxiosResponse, Error>> {
    try {
      const headers: Record<string, string> = {};
      if (this.config.accessToken) {
        // TODO(benglass): Prefix should not be hard coded in 2 places
        // But not likely to change
        headers["Authorization"] = `JWT ${this.config.accessToken}`;
      }
      const absoluteURL = this.apiPath(url);
      return Ok(await axios.get(absoluteURL, { headers }));
    } catch (e) {
      return Err(errorFromCaught(e));
    }
  }

  async getEntry(): Promise<Result<void, Error>> {
    const result = await this.request("/");

    if (result.err) {
      return result;
    }

    // Nothing meaningful to return from entry yet
    return Ok(undefined);
  }

  async getOrders(): Promise<Result<MycoTypes.OrdersResponse, Error>> {
    const encodedResult = await this.request("/orders?open=1");
    if (encodedResult.err) {
      return encodedResult;
    }

    const encoded = encodedResult.val;
    const decodeResult = MycoCodecs.safeDecode(encoded, MycoCodecs.OrdersResponsePayload);
    if (decodeResult.err) {
      return decodeResult;
    }

    const decoded = decodeResult.val;
    const ordersResponse = decoded.data;
    return Ok(ordersResponse);
  }
}
