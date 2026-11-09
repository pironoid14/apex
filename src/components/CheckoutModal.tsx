import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Building,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerInfo, PaymentMethod, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotals,
    createOrder,
    setActiveOrderForReceipt,
    setCurrentView
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [threeDSecureModal, setThreeDSecureModal] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);

  // Step 1: Shipping & Customer Info
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    suite: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [shippingSpeed, setShippingSpeed] = useState<'standard_freight' | 'expedited_air' | 'white_glove'>('standard_freight');

  // Step 2: Build Preferences
  const [osPreference, setOsPreference] = useState('windows_11_pro');
  const [includeStressCert, setIncludeStressCert] = useState(true);
  const [antiTamperSeal, setAntiTamperSeal] = useState(true);

  // Step 3: Payment Gateway
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [savePaymentDetails, setSavePaymentDetails] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCheckoutOpen) return null;

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length > 2) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  // Detect card brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('3')) return 'American Express';
    return 'Credit / Debit';
  };

  // Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!customer.fullName.trim()) errs.fullName = 'Full name is required';
    if (!customer.email.trim() || !customer.email.includes('@')) errs.email = 'Valid corporate or personal email required';
    if (!customer.phone.trim()) errs.phone = 'Phone number is required for freight delivery';
    if (!customer.address.trim()) errs.address = 'Physical delivery address is required';
    if (!customer.city.trim()) errs.city = 'City is required';
    if (!customer.state.trim()) errs.state = 'State / Province is required';
    if (!customer.zipCode.trim()) errs.zipCode = 'ZIP / Postal code is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (paymentMethod === 'credit_card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) errs.cardNumber = 'Valid 15 or 16-digit card number required';
      if (!cardHolder.trim()) errs.cardHolder = 'Cardholder name is required';
      if (expiry.length < 5) errs.expiry = 'MM/YY format required';
      if (cvv.length < 3) errs.cvv = 'Security code required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  // Process Payment Simulation with 3D Secure verification
  const handleExecutePayment = () => {
    if (!validateStep3()) return;

    setIsProcessing(true);
    setThreeDSecureModal(true);
    setAuthProgress(10);

    // Simulate 3D Secure Challenge Verification steps
    const interval = setInterval(() => {
      setAuthProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finalizeOrder();
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  const finalizeOrder = () => {
    setTimeout(() => {
      setThreeDSecureModal(false);
      setIsProcessing(false);

      const items = cart.map((item) => {
        let price = item.product.price;
        if (item.selectedWarranty === 'extended_2yr') price += 249;
        if (item.selectedWarranty === 'pro_on_site_3yr') price += 499;

        return {
          productId: item.product.id,
          productName: item.product.name,
          price,
          quantity: item.quantity,
          specsSummary: `${item.product.specs.cpu.split('(')[0]} · ${item.product.specs.gpu} · ${item.product.specs.ram}GB`,
          warranty: item.selectedWarranty === 'extended_2yr' ? '2-Year Extended' : item.selectedWarranty === 'pro_on_site_3yr' ? '3-Year On-Site SLA' : 'Standard Inclusion',
          image: item.product.image
        };
      });

      const cleanNum = cardNumber.replace(/\s/g, '');
      const last4 = cleanNum.slice(-4) || '8842';
      const brand = paymentMethod === 'credit_card' ? getCardBrand(cardNumber) : paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'google_pay' ? 'Google Pay' : 'Corporate Wire';

      const placedOrder = createOrder({
        customer,
        items,
        subtotal: cartTotals.subtotal,
        discount: cartTotals.discount,
        tax: cartTotals.tax,
        shipping: cartTotals.shipping,
        total: cartTotals.total,
        paymentMethod,
        paymentStatus: 'captured',
        paymentDetails: {
          last4,
          brand,
          transactionId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          authCode: `AUTH-TOKEN-${Math.floor(100000 + Math.random() * 900000)}`
        },
        orderStatus: 'pending',
        shippingSpeed,
        carrier: 'FedEx Insured Freight',
        estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0]
      });

      setIsCheckoutOpen(false);
      setActiveOrderForReceipt(placedOrder);
      setCurrentView('order-status');
    }, 400);
  };

  // Demo auto-fill button for effortless evaluation
  const handleAutoFill = () => {
    setCustomer({
      fullName: 'Alex Vance',
      companyName: 'Apex Quantum Research LLC',
      email: 'a.vance@quantumresearch.io',
      phone: '+1 (512) 809-3321',
      address: '901 East 5th Street, Suite 300',
      suite: 'Suite 300',
      city: 'Austin',
      state: 'TX',
      zipCode: '78702',
      country: 'United States'
    });
    setCardNumber('4242 4242 4242 4242');
    setCardHolder('ALEX VANCE');
    setExpiry('08/29');
    setCvv('842');
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Encrypted Checkout & Payment Gateway</h2>
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mt-0.5">
                <span>TLS 1.3 256-Bit SSL</span>
                <span aria-hidden="true">·</span>
                <span>PCI-DSS Level 1 Verified</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFill}
              type="button"
              className="px-2.5 py-1 text-xs font-mono bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded border border-neutral-700 transition-colors cursor-pointer"
              title="Auto-fill sample verified details for quick testing"
            >
              Demo Auto-Fill
            </button>
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="px-6 py-3 border-b border-neutral-800/80 bg-neutral-950/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 sm:gap-4">
            <span
              className={`font-mono font-medium ${
                step === 1 ? 'text-amber-400' : 'text-neutral-500'
              }`}
            >
              01. Delivery & Entity
            </span>
            <span className="text-neutral-700">/</span>
            <span
              className={`font-mono font-medium ${
                step === 2 ? 'text-amber-400' : 'text-neutral-500'
              }`}
            >
              02. Build Directives
            </span>
            <span className="text-neutral-700">/</span>
            <span
              className={`font-mono font-medium ${
                step === 3 ? 'text-amber-400' : 'text-neutral-500'
              }`}
            >
              03. Payment Gateway
            </span>
          </div>

          <div className="text-neutral-400 font-mono text-[11px] hidden sm:block">
            Step {step} of 3
          </div>
        </div>

        {/* Main Layout: Form Left, Order Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[75vh] overflow-y-auto">
          {/* Form Side */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            {/* STEP 1: Delivery Address & Entity Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Shipping & Consignee Information</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Hardware shipments require direct adult signature and ID verification upon delivery.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-300 font-medium mb-1">
                      Full Legal Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Vance"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    />
                    {errors.fullName && <p className="text-rose-400 text-[11px] mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Company / Studio (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Vance Labs LLC"
                      value={customer.companyName}
                      onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Business Email <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="alex@example.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    />
                    {errors.email && <p className="text-rose-400 text-[11px] mt-1">{errors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-neutral-300 font-medium mb-1">
                      Delivery Address <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Street address, building, suite"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    />
                    {errors.address && <p className="text-rose-400 text-[11px] mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      City <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    />
                    {errors.city && <p className="text-rose-400 text-[11px] mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      State / Province <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="State (e.g. TX)"
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    />
                    {errors.state && <p className="text-rose-400 text-[11px] mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      ZIP / Postal Code <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ZIP code"
                      value={customer.zipCode}
                      onChange={(e) => setCustomer({ ...customer, zipCode: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    />
                    {errors.zipCode && <p className="text-rose-400 text-[11px] mt-1">{errors.zipCode}</p>}
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">
                      Carrier SMS Notifications <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    />
                    {errors.phone && <p className="text-rose-400 text-[11px] mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Shipping Method Choice */}
                <div className="pt-3 space-y-2">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Insured Freight Logistics Option
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setShippingSpeed('standard_freight')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        shippingSpeed === 'standard_freight'
                          ? 'border-amber-400 bg-amber-400/5'
                          : 'border-neutral-800 bg-neutral-950/40'
                      }`}
                    >
                      <div className="flex justify-between font-semibold text-white">
                        <span>Palletized Freight</span>
                        <span className="font-mono text-amber-400">Included</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">3–5 Business Days · Liftgate service</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShippingSpeed('white_glove')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        shippingSpeed === 'white_glove'
                          ? 'border-amber-400 bg-amber-400/5'
                          : 'border-neutral-800 bg-neutral-950/40'
                      }`}
                    >
                      <div className="flex justify-between font-semibold text-white">
                        <span>White Glove Uncrating</span>
                        <span className="font-mono text-amber-400">+$120</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">Inside delivery, debris removal, inspection</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Custom Assembly & Inspection Options */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white">Hardware Assembly & Deployment Directives</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Each rig is assembled in our cleanroom facility in Austin, Texas.
                  </p>
                </div>

                {/* OS Configuration */}
                <div className="space-y-2 text-xs">
                  <label className="block font-medium text-neutral-300">Pre-Installed Operating System</label>
                  <div className="space-y-2">
                    {[
                      { id: 'windows_11_pro', label: 'Windows 11 Pro 64-Bit (Clean Bloatware-Free OEM License)' },
                      { id: 'ubuntu_24_04', label: 'Ubuntu 24.04 LTS Desktop with NVIDIA CUDA Drivers Pre-Configured' },
                      { id: 'dual_boot', label: 'Dual-Boot (Windows 11 Pro + Ubuntu 24.04 on Partitioned SSD)' },
                      { id: 'unformatted', label: 'Unformatted Drives (Raw Hardware for Custom Enterprise PXE Image)' }
                    ].map((os) => (
                      <label
                        key={os.id}
                        onClick={() => setOsPreference(os.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          osPreference === os.id
                            ? 'border-amber-400 bg-amber-400/5 text-white'
                            : 'border-neutral-800 bg-neutral-950/40 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="os"
                          checked={osPreference === os.id}
                          onChange={() => setOsPreference(os.id)}
                          className="accent-amber-400"
                        />
                        <span className="text-xs">{os.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quality Assurance Checks */}
                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 space-y-3 text-xs">
                  <span className="font-semibold text-white block">Quality Assurance Credentials</span>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeStressCert}
                      onChange={(e) => setIncludeStressCert(e.target.checked)}
                      className="accent-amber-400 rounded"
                    />
                    <span>Include physical laminated 48-Hour Thermal & Memory Stability Test Certificate</span>
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={antiTamperSeal}
                      onChange={(e) => setAntiTamperSeal(e.target.checked)}
                      className="accent-amber-400 rounded"
                    />
                    <span>Apply tamper-evident holographic serial seal over side-chassis thumbscrews</span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 3: Secure Payment Gateway */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white">Payment Method & Tokenization</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Transactions are tokenized end-to-end. Your raw card credentials never hit our servers.
                  </p>
                </div>

                {/* Method Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'credit_card'
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'apple_pay'
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold text-sm tracking-tight">Pay</span>
                    <span>Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wire_transfer')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'wire_transfer'
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Building className="w-4 h-4 text-amber-400" />
                    <span>ACH / Wire</span>
                  </button>
                </div>

                {/* Credit Card Interactive Inputs */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    {/* Simulated Sleek Card Badge */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-700/80 shadow-md space-y-3">
                      <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                        <span className="tracking-wider uppercase">{getCardBrand(cardNumber)}</span>
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div className="font-mono text-base tracking-widest text-white">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end text-xs font-mono text-neutral-400">
                        <div>
                          <div className="text-[9px] uppercase text-neutral-500">Cardholder</div>
                          <div className="text-white truncate max-w-[180px]">
                            {cardHolder || 'FULL NAME'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase text-neutral-500">Expires</div>
                          <div className="text-white">{expiry || 'MM/YY'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-neutral-300 font-medium mb-1">
                          Card Number <span className="text-amber-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            className="w-full pl-3 pr-10 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-neutral-400">
                            {getCardBrand(cardNumber)}
                          </div>
                        </div>
                        {errors.cardNumber && <p className="text-rose-400 text-[11px] mt-1">{errors.cardNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-medium mb-1">
                          Cardholder Name <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="As printed on card"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white uppercase focus:outline-none focus:border-amber-400"
                        />
                        {errors.cardHolder && <p className="text-rose-400 text-[11px] mt-1">{errors.cardHolder}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-neutral-300 font-medium mb-1">
                            Expiration (MM/YY) <span className="text-amber-400">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
                          />
                          {errors.expiry && <p className="text-rose-400 text-[11px] mt-1">{errors.expiry}</p>}
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-medium mb-1">
                            CVV / CVC <span className="text-amber-400">*</span>
                          </label>
                          <input
                            type="password"
                            placeholder="3 or 4 digits"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            maxLength={4}
                            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
                          />
                          {errors.cvv && <p className="text-rose-400 text-[11px] mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'apple_pay' && (
                  <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950 text-center space-y-3">
                    <div className="text-xl font-bold text-white">Apple Pay Quick Express</div>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Biometric Touch ID or Face ID verification will prompt to authenticate this transaction securely.
                    </p>
                  </div>
                )}

                {paymentMethod === 'wire_transfer' && (
                  <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 text-xs space-y-2">
                    <span className="font-semibold text-white block">Corporate Net-30 / ACH Routing</span>
                    <p className="text-neutral-400">
                      An official pro-forma invoice will be generated upon order completion. Build will enter component reservation immediately.
                    </p>
                    <div className="font-mono text-[11px] text-neutral-300 bg-neutral-900 p-2 rounded">
                      Bank: JPMorgan Chase NA · Wire Swift: CHASUS33 · Account: Apex Systems Enterprise
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev - 1) as any)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all shadow-lg shadow-amber-400/20 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    Authorize Payment (${cartTotals.total.toFixed(2)})
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 bg-neutral-950 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Order Review ({cart.length} Builds)
              </h4>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold truncate">{item.product.name}</div>
                      <div className="text-neutral-400 text-[11px] font-mono">
                        Qty: {item.quantity} · ${(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-neutral-800/80 space-y-2 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-200 tabular-nums">
                    ${cartTotals.subtotal.toLocaleString()}
                  </span>
                </div>
                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Coupon Savings</span>
                    <span className="font-mono tabular-nums">
                      -${cartTotals.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Freight & Cargo Insurance</span>
                  <span className="font-mono text-neutral-200 tabular-nums">
                    {cartTotals.shipping === 0 ? 'FREE' : `$${cartTotals.shipping}`}
                  </span>
                </div>
                {shippingSpeed === 'white_glove' && (
                  <div className="flex justify-between text-neutral-300">
                    <span>White-Glove Inside Delivery</span>
                    <span className="font-mono text-amber-400 tabular-nums">+$120.00</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (8.25%)</span>
                  <span className="font-mono text-neutral-200 tabular-nums">
                    ${cartTotals.tax.toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex justify-between text-base font-bold text-white">
                  <span>Amount to Bill</span>
                  <span className="font-mono text-amber-400 tabular-nums">
                    ${(cartTotals.total + (shippingSpeed === 'white_glove' ? 120 : 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Proof */}
            <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Buyer Protection Guarantee</span>
              </div>
              <p className="leading-relaxed">
                Full refund guarantee if shipment arrives with any transit vibration shock damage or unverified bench results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Secure / Bank Authorization Overlay Simulation */}
      {threeDSecureModal && (
        <div className="fixed inset-0 z-60 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">3D Secure 2.0 Challenge</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Authenticating with card issuer network ({paymentMethod === 'credit_card' ? getCardBrand(cardNumber) : 'Security Gateway'})...
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${authProgress}%` }}
              />
            </div>

            <div className="text-xs font-mono text-amber-400 font-semibold">
              {authProgress < 40 && 'Performing fraud scoring risk telemetry...'}
              {authProgress >= 40 && authProgress < 80 && 'Validating cryptographic cryptogram...'}
              {authProgress >= 80 && 'Transaction Approved · Allocating Inventory...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
