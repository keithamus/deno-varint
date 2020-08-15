export const MaxUInt64 = 18446744073709551615n;
export const MaxVarIntLen64 = 10;
export const MaxVarIntLen32 = 5;

const MSB = 0x80;
const REST = 0x7f;
const SHIFT = 7;
const MSBN = 0x80n;
const SHIFTN = 7n;

export function decode(buf: Uint8Array, offset = 0): [bigint, number] {
  for (
    let i = offset,
      len = Math.min(buf.length, offset + MaxVarIntLen64),
      shift = 0,
      decoded = 0n;
    i < len;
    i += 1, shift += SHIFT
  ) {
    let byte = buf[i];
    decoded += BigInt((byte & REST) * Math.pow(2, shift));
    if (!(byte & MSB) && decoded > MaxUInt64) {
      throw new RangeError("overflow varint");
    }
    if (!(byte & MSB)) return [decoded, i - offset + 1];
  }
  throw new RangeError("malformed or overflow varint");
}

export function decode32(buf: Uint8Array, offset = 0): [number, number] {
  for (
    let i = offset,
      len = Math.min(buf.length, offset + MaxVarIntLen32),
      shift = 0,
      decoded = 0;
    i <= len;
    i += 1, shift += SHIFT
  ) {
    let byte = buf[i];
    decoded += (byte & REST) * Math.pow(2, shift);
    if (!(byte & MSB)) return [decoded, i - offset + 1];
  }
  throw new RangeError("malformed or overflow varint");
}

export function encode(
  num: bigint | number,
  buf: Uint8Array = new Uint8Array(MaxVarIntLen64),
  offset = 0,
): [Uint8Array, number] {
  num = BigInt(num);
  if (num < 0n) throw new RangeError("signed input given");
  for (
    let i = offset, len = Math.min(buf.length, MaxVarIntLen64);
    i <= len;
    i += 1
  ) {
    if (num < MSBN) {
      buf[i] = Number(num);
      i += 1
      return [buf.slice(offset, i), i];
    }
    buf[i] = Number((num & 0xFFn) | MSBN);
    num >>= SHIFTN;
  }
  throw new RangeError(`${num} overflows uint64`);
}
