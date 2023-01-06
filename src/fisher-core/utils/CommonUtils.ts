export function range(value: number, rangeScope: number) {
  const isRaiseCorrection = roll(50);
  const correctionValue = Math.round(value * random(0, rangeScope) * 0.01);

  let result = value;

  if (isRaiseCorrection) {
    result += correctionValue;
  } else {
    result -= correctionValue;
  }

  return result;
}

export function roll(probability: number) {
  if (probability >= 100) return true;
  return probability >= random(0, 100);
}

export function random(min: number, max: number): number {
  var rval = 0;
  var range = max - min;

  var bits_needed = Math.ceil(Math.log2(range));
  if (bits_needed > 53) {
    throw new Error('We cannot generate numbers larger than 53 bits.');
  }
  var bytes_needed = Math.ceil(bits_needed / 8);
  var mask = Math.pow(2, bits_needed) - 1;
  // 7776 -> (2^13 = 8192) -1 == 8191 or 0x00001111 11111111

  // Create byte array and fill with N random numbers
  var byteArray = new Uint8Array(bytes_needed);
  window.crypto.getRandomValues(byteArray);

  var p = (bytes_needed - 1) * 8;
  for (var i = 0; i < bytes_needed; i++) {
    rval += byteArray[i] * Math.pow(2, p);
    p -= 8;
  }

  // Use & to apply the mask and reduce the number of recursive lookups
  rval = rval & mask;

  if (rval >= range) {
    // Integer out of acceptable range
    return random(min, max);
  }
  // Return an integer that falls within the range
  return min + rval;
}
