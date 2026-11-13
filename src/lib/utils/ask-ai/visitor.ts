import { isIPv6 } from "node:net";

/** "2001:db8:1:2:3::4" becomes "2001:db8:1:2::/64", the network it's in. */
const ipv6Network = (ip: string) => {
    const [head, tail] = ip.split("::");
    const left = head ? head.split(":") : [];
    const right = tail ? tail.split(":") : [];
    const groups =
        tail === undefined
            ? left
            : [
                  ...left,
                  ...Array<string>(8 - left.length - right.length).fill("0"),
                  ...right,
              ];
    const prefix = groups.slice(0, 4).map((group) => parseInt(group, 16));
    return `${prefix.map((group) => group.toString(16)).join(":")}::/64`;
};

/**
 * Who is asking, for rate limiting. The site runs behind Cloudflare, which
 * sets `cf-connecting-ip` and overwrites any value the visitor sends, so it
 * can't be faked as long as the server is only reachable through Cloudflare.
 *
 * An IPv6 home connection gets a whole /64 of addresses, so the /64 counts
 * as one visitor. Otherwise changing address would reset the limits.
 *
 * `undefined` outside Cloudflare, except in development.
 */
const visitorOf = (request: Request) => {
    const ip = request.headers.get("cf-connecting-ip");
    if (!ip) {
        return process.env.NODE_ENV === "development" ? "local" : undefined;
    }
    return isIPv6(ip) ? ipv6Network(ip) : ip;
};

export { visitorOf };
