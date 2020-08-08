## VarInt

Encode/Decode Number/BigInts into an array of [Varint bytes](https://developers.google.com/protocol-buffers/docs/encoding#varints)

### Usage

```typescript
import {encode, decode} from 'https://deno.land/x/varint@v1.0.0/varint.ts'

encode(300) // [Uint8Array.of(0xAC, 0x02), 2]
// BigInts work too!
encode(300n) // [Uint8Array.of(0xAC, 0x02), 2]

// Or give it an existing Uint8Array
const pre = Uint8Array(0xFA, 0xCE)
encode(300, pre, 2) // [Uint8Array.of(0xFA, 0xCE, 0xAC, 0x02), 2]


// Decode varints:
decode(Uint8Array.of(0xAC, 0x02)) // [300n, 2]

// If you know your VarInt is only 32-bit then you can call decode32 to get a `Number` back
decode32(Uint8Array.of(0xAC, 0x02)) // [300, 2]

// You can also pass an offset!
decode32(Uint8Array.of(0xFA, 0xCE, 0xAC, 0x02), 2) // [300, 2]
```
