import jwt from "jsonwebtoken";
import { Err, Ok, Result } from "ts-results";

export type User = {
  userId: string;
};

export type SigningKey = {
  readonly keyId: string;
  readonly privateKey: string;
};

export class TokenSigner {
  constructor(private key: SigningKey) {}

  sign(user: User): Result<string, Error> {
    const payload = {
      sub: user.userId,
    };

    try {
      const token = jwt.sign(payload, this.key.privateKey, {
        algorithm: "RS256",
        keyid: this.key.keyId,
      });

      return Ok(token);
    } catch (e) {
      return Err(e as Error);
    }
  }
}
