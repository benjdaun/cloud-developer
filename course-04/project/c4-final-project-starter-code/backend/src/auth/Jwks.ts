/**
 * Interface representing a JWk Set, where the keys are all kept in an array named keys,
 * and each key has the properties listed in the Key interface.
 */
export interface Jwks {
    keys: Key[];
}

export interface Key {
    alg: string;
    kty: string;
    use: string;
    n: string;
    e: string;
    kid: string;
    x5t: string;
    x5c: string[];
}

