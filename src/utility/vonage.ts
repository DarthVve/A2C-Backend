import Vonage from '@vonage/server-sdk';

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY as string,
  apiSecret: process.env.VONAGE_API_SECRET as string,
})

export function numberToE164(number: string, countryCode = '234'): string {
  const cleaned = ('' + number).replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return `+${countryCode}${cleaned.substring(1)}`;
  } else if (cleaned.startsWith(countryCode)) {
    return `+${cleaned}`;
  } else {
    return number;
  }
}

export default vonage;

