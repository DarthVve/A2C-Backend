import axios from 'axios';
import { banks as fallbackBanks } from './getRandomBank';

export const cachedBanks: any[] = [];

export const getBanks = async () => {
  try {
    if (cachedBanks.length) {
      return cachedBanks;
    } else {
      const { data } = await axios.get('https://api.flutterwave.com/v3/banks/NG', {
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer '+ process.env.FLUTTERWAVE_SECRET_KEY
        }
      });
      cachedBanks.push(...data.data);
      return data.data;
    }
  } catch (error) {
    console.error(error);
    cachedBanks.push(...fallbackBanks);
    return cachedBanks;
  }
}


