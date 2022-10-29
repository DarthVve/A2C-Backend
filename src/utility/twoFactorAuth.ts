import { token } from 'morgan';
import { generateSecret, generateToken, verifyToken } from 'node-2fa';

const secret2FA = generateSecret({
  name: "Airtime2Cash",
  account: "podE"
});

export const token2FA = () => {
  try {
    const { token } = generateToken(secret2FA.secret) || { token: null };
    return token;
  } catch (e) {
    console.error(e)
    return null;
  }
}

export const isValid2FA = (token: string) => {
  try {
    const { delta } = verifyToken(secret2FA.secret, token, 60) || { delta: null };
    console.log(delta);
    return typeof delta === 'number';
  } catch (e) {
    console.error(e)
    return false;
  }
}
