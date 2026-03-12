const BaseProvider = require('./baseProvider');
const axios = require('axios');
const qs = require('qs');

class QPayProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.baseUrl = config.apiBase;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.callbackUrl = config.callbackUrl;

    this.token = null;
    this.tokenExpiresAt = 0;
  }

  async getToken() {
    // const now = Date.now();
    // if (this.token && now < this.tokenExpiresAt) return this.token;

    // const data = qs.stringify({
    //   grant_type: 'client_credentials',
    //   client_id: this.clientId,
    //   client_secret: this.clientSecret
    // });

    // const res = await axios.post(`${this.baseUrl}/oauth2/token`, data, {
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // });

    // this.token = res.data.access_token;
    // this.tokenExpiresAt = now + (res.data.expires_in * 1000) - 60000;
    // return this.token;

    return "123"
  }

  async createPayment(amount, metadata) {
    // const token = await this.getToken();

    // const res = await axios.post(
    //   `${this.baseUrl}/invoice`,
    //   {
    //     amount,
    //     metadata,
    //     callback_url: this.callbackUrl,
    //   },
    //   { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    // );

     return {
      invoice_id: "00f94137-66fd-4d90-b2b2-8225c1b4ed2d",
      qr_text: "00020101021215312794049627940496000000000QOCHIR52047299530349654031005802MN5924MYERCHANT-DASGALJUULAGCH6011Ulaanbaatar6244010712345670504test0721kG8y2jPepqll5M7lnx9ay6304B550",
      qr_image: "00020101021215312794049627940496000000000QOCHIR52047299530349654031005802MN5924MYERCHANT-DASGALJUULAGCH6011Ulaanbaatar6244010712345670504test0721kG8y2jPepqll5M7lnx9ay6304B550",
    };
  }

  async getPaymentStatus(paymentId) {
    const token = await this.getToken();

    const res = await axios.get(`${this.baseUrl}/payment/${paymentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      id: res.data.id,
      status: res.data.status,
      raw: res.data,
    };
  }
}

module.exports = QPayProvider;
