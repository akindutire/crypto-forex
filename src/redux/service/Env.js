const prod = true;
const domain = prod ? 'https://crypto-forex-backend.herokuapp.com/' : 'http://localhost:5000/';
export const getDomain = () => { return domain; }
