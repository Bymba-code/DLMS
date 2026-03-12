const QPayProvider = require('../providers/qpayProvider');

class PaymentService {
  constructor() {
    this.providers = {
      qpay: new QPayProvider({
        apiBase: process.env.QPAY_API_BASE,
        clientId: process.env.QPAY_CLIENT_ID,
        clientSecret: process.env.QPAY_CLIENT_SECRET,
        callbackUrl: process.env.QPAY_CALLBACK_URL,
      })
    };
  }

  async createPayment(method, amount, metadata = {}) {
    const provider = this.providers[method];
    if (!provider) throw new Error(`Unsupported payment method: ${method}`);
    return await provider.createPayment(amount, metadata);
  }

  async getPaymentStatus(method, paymentId) {
    const provider = this.providers[method];
    if (!provider) throw new Error(`Unsupported payment method: ${method}`);
    return await provider.getPaymentStatus(paymentId);
  }
}

module.exports = new PaymentService();
