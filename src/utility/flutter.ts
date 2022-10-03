import axios from 'axios';

export const cachedBanks: any[] = [];

export const getBanks = async () => {
  try {
    if (cachedBanks.length) {
      return cachedBanks;
    } else {
      const { data } = await axios.get('https://api.flutterwave.com/v3/banks/NG', {
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + process.env.FLW_SECRET_KEY
        }
      });
      cachedBanks.push(...data.data);
      return data.data;
    }
  } catch (error) {
    console.error(error);
  }
}


