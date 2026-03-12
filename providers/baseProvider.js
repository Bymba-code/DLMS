class BaseProvider {
  constructor(config) {
    this.config = config;
  }

  async createPayment(amount, metadata) {
    throw new Error("createPayment() must be implemented by subclass");
  }

  async getPaymentStatus(paymentId) {
    throw new Error("getPaymentStatus() must be implemented by subclass");
  }
}

module.exports = BaseProvider;
