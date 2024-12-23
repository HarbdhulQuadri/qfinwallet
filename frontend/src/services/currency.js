import axios from 'axios';

class CurrencyService {
  constructor() {
    this.baseUrl = 'https://api.currencylayer.com';
    this.apiKey = process.env.REACT_APP_CURRENCY_API_KEY;
    this.cache = new Map();
    this.cacheTimeout = 3600000; // 1 hour
  }

  async getRates() {
    const cacheKey = 'rates';
    if (this.cache.has(cacheKey)) {
      const { timestamp, data } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < this.cacheTimeout) {
        return data;
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/live`, {
        params: {
          access_key: this.apiKey,
          source: 'USD'
        }
      });

      if (response.data.success) {
        this.cache.set(cacheKey, {
          timestamp: Date.now(),
          data: response.data.quotes
        });
        return response.data.quotes;
      }
      throw new Error('Failed to fetch rates');
    } catch (error) {
      throw new Error('Currency service unavailable');
    }
  }

  async convert(amount, from, to) {
    const rates = await this.getRates();
    if (!rates) throw new Error('Exchange rates not available');

    const fromRate = from === 'USD' ? 1 : 1 / rates[`USD${from}`];
    const toRate = rates[`USD${to}`];
    
    return (amount * fromRate * toRate).toFixed(2);
  }
}

export default new CurrencyService();
