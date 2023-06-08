import dayjs from 'dayjs';

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
  crypto.getRandomValues(byteArray);

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

export function randomString(stringLength: number) {
  let result = '';
  let charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < stringLength; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return result;
}

export function generateTimestamp(): number {
  return dayjs().valueOf();
}

export function debounce(func: any, wait: number, immediate = false) {
  // 'private' variable for instance
  // The returned function will be able to reference this due to closure.
  // Each call to the returned function will share this common timer.
  let timeout: any | undefined = undefined;

  // Calling debounce returns a new anonymous function
  return function (...args: any[]) {
    // reference the context and args for the setTimeout function

    // Should the function be called now? If immediate is true
    //   and not already in a timeout then the answer is: Yes
    var callNow = immediate && !timeout;

    // This is the basic debounce behaviour where you can call this
    //   function several times, but it will only execute once
    //   (before or after imposing a delay).
    //   Each time the returned function is called, the timer starts over.
    clearTimeout(timeout);

    // Set the new timeout
    timeout = setTimeout(function () {
      // Inside the timeout function, clear the timeout variable
      // which will let the next execution run when in 'immediate' mode
      timeout = undefined;

      // Check if the function already ran with the immediate flag
      if (!immediate) {
        // Call the original function with apply
        // apply lets you define the 'this' object as well as the arguments
        //    (both captured before setTimeout)
        func.apply(null, args);
      }
    }, wait);

    // Immediate mode and no wait timer? Execute the function...
    if (callNow) func.apply(null, args);
  };
}
