import { Product, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'pc-apex-one',
    name: 'Apex-Liquid Extreme 9950X',
    tagline: 'Flagship Hardline Liquid-Cooled 4K Gaming & Rendering Beast',
    category: 'gaming',
    brand: 'ApexRig',
    price: 4899,
    originalPrice: 5299,
    rating: 4.95,
    reviewsCount: 38,
    image: '/src/assets/images/hero_custom_workstation_1794212401925.jpg',
    specs: {
      cpu: 'AMD Ryzen 9 9950X (16C/32T up to 5.7GHz)',
      gpu: 'NVIDIA GeForce RTX 4090 24GB GDDR6X',
      ram: 64,
      ramType: '64GB DDR5-6400MHz RGB Low-Latency',
      storage: '4TB Gen5 NVMe M.2 SSD (14,000 MB/s)',
      formFactor: 'Full Tower',
      cooling: 'Custom EKWB Hardline 360mm Dual Loop',
      powerSupply: '1200W 80+ Titanium ATX 3.0 PCIe 5.0',
      motherboard: 'ASUS ROG Crosshair X670E Hero',
      ports: ['2x USB4 Type-C', '8x USB 3.2 Gen2', '2.5G & 10G LAN', 'Wi-Fi 7', 'Optical Audio']
    },
    benchmarks: {
      cyberpunkFps4k: 124,
      cinebenchR23: 44200,
      timespyScore: 36800,
      blenderRenderSec: 21
    },
    stock: 7,
    status: 'in_stock',
    featured: true,
    description: 'Precision hand-crafted liquid cooled desktop engineered for peak 4K ultra ray tracing, heavy video production, and local LLM fine-tuning. Every tube is individually bent and pressure tested for 48 hours.',
    warranty: '3-Year On-Site White Glove & Lifetime Technical Support',
    includedAccessories: ['Braided Cable Kit', 'Custom Hard Shell Shipping Crate', 'EKWB Maintenance Kit', 'Apex Mechanical Tool Pen']
  },
  {
    id: 'pc-studio-creator',
    name: 'Precision Studio Pro 14900KS',
    tagline: 'Silent Acoustic High-Density Workstation for 3D & VFX',
    category: 'workstation',
    brand: 'SiliconForge',
    price: 3799,
    originalPrice: 3999,
    rating: 4.88,
    reviewsCount: 52,
    image: '/src/assets/images/product_studio_workstation_1794212402879.jpg',
    specs: {
      cpu: 'Intel Core i9-14900KS (24C/32T up to 6.2GHz)',
      gpu: 'NVIDIA GeForce RTX 4080 Super 16GB Studio Edition',
      ram: 96,
      ramType: '96GB (2x48GB) DDR5-6000MHz ECC-on-die',
      storage: '4TB Samsung 990 Pro PCIe 4.0 NVMe',
      formFactor: 'Mid Tower',
      cooling: 'Noctua Chromax Black Industrial 360mm Closed Loop',
      powerSupply: '1000W 80+ Platinum Fully Modular',
      motherboard: 'ProArt Z790-Creator WiFi',
      ports: ['2x Thunderbolt 4 / USB-C', '6x USB 3.2 Gen2', '10GbE + 2.5GbE Ethernet', 'Wi-Fi 7']
    },
    benchmarks: {
      cyberpunkFps4k: 92,
      cinebenchR23: 41800,
      timespyScore: 28900,
      blenderRenderSec: 26
    },
    stock: 12,
    status: 'in_stock',
    featured: true,
    description: 'Acoustically dampened studio powerhouse encased in anodized aluminum with fine front mesh. Certified for Premiere Pro, DaVinci Resolve Studio, Maya, and Unreal Engine 5.4.',
    warranty: '3-Year Advanced Hardware Replacement & Priority Support',
    includedAccessories: ['DisplayPort 2.1 Braided Cable', 'Thunderbolt 4 Cable', 'Anti-Static Cleaning Cloth']
  },
  {
    id: 'pc-esports-compact',
    name: 'Velox Mini-ITX Horizon',
    tagline: 'Compact Footprint Desktop with Unthrottled 4K Esports Power',
    category: 'mini-itx',
    brand: 'Velox',
    price: 2599,
    originalPrice: 2799,
    rating: 4.91,
    reviewsCount: 29,
    image: '/src/assets/images/product_esports_desktop_1794212404426.jpg',
    specs: {
      cpu: 'AMD Ryzen 7 7800X3D (8C/16T with 3D V-Cache)',
      gpu: 'NVIDIA GeForce RTX 4070 Ti Super 16GB',
      ram: 32,
      ramType: '32GB DDR5-6000MHz CL30 EXPO',
      storage: '2TB PCIe 4.0 NVMe M.2 SSD',
      formFactor: 'Mini-ITX',
      cooling: '280mm AIO Liquid Cooler with Custom Braided Tubing',
      powerSupply: '850W 80+ Gold SFX-L Quiet Power Supply',
      motherboard: 'ASUS ROG Strix B650E-I Gaming WiFi',
      ports: ['1x USB-C 3.2 Gen2x2', '5x USB 3.2', '2.5G LAN', 'Wi-Fi 6E']
    },
    benchmarks: {
      cyberpunkFps4k: 78,
      cinebenchR23: 18500,
      timespyScore: 24200,
      blenderRenderSec: 48
    },
    stock: 5,
    status: 'low_stock',
    featured: true,
    description: 'Only 14.8 liters volume yet packed with the world’s fastest gaming processor and vertical GPU bracket. Perfect for competitive tournament travel and minimalist desk setups.',
    warranty: '2-Year Full Coverage & Overnight Courier Repair',
    includedAccessories: ['Padded Ballistic Nylon Travel Bag', 'Custom 90-Degree Power Cord']
  },
  {
    id: 'pc-creator-laptop-16',
    name: 'TitanWorks StudioBook 16 Pro',
    tagline: 'CNC Aluminum Mobile Workstation with Calibrated 4K OLED',
    category: 'laptop',
    brand: 'TitanWorks',
    price: 3299,
    originalPrice: 3499,
    rating: 4.82,
    reviewsCount: 64,
    image: '/src/assets/images/product_creator_laptop_1794212405122.jpg',
    specs: {
      cpu: 'Intel Core Ultra 9 185H (16 Cores + NPU AI Engine)',
      gpu: 'NVIDIA GeForce RTX 4080 Mobile 12GB (175W Max TGP)',
      ram: 64,
      ramType: '64GB LPDDR5X-7467MHz Dual Channel',
      storage: '2TB Gen4 M.2 NVMe SSD (Expandable Dual Slot)',
      formFactor: 'Laptop',
      cooling: 'Dual Vapor Chamber with Liquid Metal TIM',
      powerSupply: '280W GaN Slim Fast Charger',
      ports: ['2x Thunderbolt 4', '2x USB-A 3.2', 'HDMI 2.1 FRL', 'Full-Size UHS-II SD Card Reader', '3.5mm Audio']
    },
    benchmarks: {
      cyberpunkFps4k: 64,
      cinebenchR23: 27400,
      timespyScore: 19800,
      blenderRenderSec: 42
    },
    stock: 8,
    status: 'in_stock',
    featured: false,
    description: 'Precision milled aerospace-grade aluminum chassis with 16-inch 3840x2400 120Hz OLED display (100% DCI-P3, Delta-E < 1.0 calibrated). Hardware MUX switch and dedicated AI NPU for local generative tasks.',
    warranty: '2-Year Global Warranty with Accidental Damage Protection',
    includedAccessories: ['280W GaN Power Brick', '100W USB-C Travel Adapter', 'Color Calibration Report']
  },
  {
    id: 'pc-ai-cluster-dual-gpu',
    name: 'NovaCore AI Matrix Dual-4090',
    tagline: 'Enterprise Deep Learning & LLM Inference Rack Workstation',
    category: 'server',
    brand: 'NovaCore',
    price: 9499,
    originalPrice: 9999,
    rating: 4.98,
    reviewsCount: 16,
    image: '/src/assets/images/product_dual_gpu_tower_1794212405193.jpg',
    specs: {
      cpu: 'AMD Ryzen Threadripper 7970X (32C/64T up to 5.3GHz)',
      gpu: 'Dual NVIDIA RTX 4090 24GB (48GB Total VRAM)',
      ram: 128,
      ramType: '128GB (4x32GB) Quad-Channel DDR5-5200MHz ECC RDIMM',
      storage: '8TB Enterprise NVMe (2x 4TB RAID 0/1)',
      formFactor: '4U Rackmount',
      cooling: 'Direct-Die Server Liquid Cold Plates + 5000 RPM Delta Fans',
      powerSupply: '2000W 80+ Titanium Redundant Dual PSU',
      motherboard: 'ASRock Rack TRX50D8-2L2T',
      ports: ['Dual 10GBase-T LAN', 'Dedicated IPMI Remote KVM Port', '4x USB 3.2 Gen2', 'PCIe 5.0 x16 slots']
    },
    benchmarks: {
      cinebenchR23: 84600,
      timespyScore: 49200,
      blenderRenderSec: 11
    },
    stock: 2,
    status: 'low_stock',
    featured: true,
    description: 'Designed for machine learning engineering teams running 70B parameter models quantized locally, multi-stream NeRF generation, and massive simulation batches. Fully remote IPMI server management enabled.',
    warranty: '3-Year Mission-Critical 4-Hour Onsite Replacement SLA',
    includedAccessories: ['4U Telescopic Ball-Bearing Rack Rails', 'NEMA Heavy-Duty Power Cables', 'Locking Front Bezel Keys']
  },
  {
    id: 'pc-stealth-workstation',
    name: 'SiliconForge Creator Pro 9900X',
    tagline: 'Balanced Architecture for Color Grading, CAD & Architecture',
    category: 'workstation',
    brand: 'SiliconForge',
    price: 2899,
    originalPrice: 3099,
    rating: 4.86,
    reviewsCount: 41,
    image: '/src/assets/images/product_studio_workstation_1794212402879.jpg',
    specs: {
      cpu: 'AMD Ryzen 9 9900X (12C/24T up to 5.6GHz)',
      gpu: 'NVIDIA RTX 4070 Ti Super 16GB',
      ram: 64,
      ramType: '64GB DDR5-6000MHz Kingston Fury Renegade',
      storage: '2TB PCIe 4.0 NVMe + 4TB Enterprise Storage HDD',
      formFactor: 'Mid Tower',
      cooling: 'DeepCool LT720 High-Performance 360mm AIO',
      powerSupply: '850W 80+ Gold ATX 3.0',
      motherboard: 'Gigabyte X670 AORUS ELITE AX',
      ports: ['1x USB-C 3.2 Gen2x2', '8x USB 3.2', '2.5G Realtek LAN', 'Wi-Fi 6E']
    },
    benchmarks: {
      cyberpunkFps4k: 72,
      cinebenchR23: 33800,
      timespyScore: 23100,
      blenderRenderSec: 34
    },
    stock: 9,
    status: 'in_stock',
    featured: false,
    description: 'The golden balance of multi-threaded rendering efficiency and real-time viewport responsiveness for architects using Revit, AutoCAD, 3ds Max, and Lumion.',
    warranty: '3-Year Parts and Labor Support',
    includedAccessories: ['Quick Start Setup Guide', 'Wi-Fi High-Gain Magnetic Antenna']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-89241',
    createdAt: '2026-11-08T18:42:00Z',
    customer: {
      fullName: 'Marcus Vance',
      companyName: 'Vance Spatial Labs',
      email: 'm.vance@vancelabs.io',
      phone: '+1 (415) 890-2104',
      address: '450 Mission Street, Suite 1200',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States'
    },
    items: [
      {
        productId: 'pc-ai-cluster-dual-gpu',
        productName: 'NovaCore AI Matrix Dual-4090',
        price: 9499,
        quantity: 1,
        specsSummary: 'Threadripper 7970X · Dual RTX 4090 · 128GB ECC',
        warranty: '3-Year Mission Critical SLA',
        image: '/src/assets/images/product_dual_gpu_tower_1794212405193.jpg'
      }
    ],
    subtotal: 9499,
    discount: 0,
    tax: 783.67,
    shipping: 150,
    total: 10432.67,
    paymentMethod: 'wire_transfer',
    paymentStatus: 'captured',
    paymentDetails: {
      last4: '7192',
      brand: 'Corporate Wire',
      transactionId: 'TXN-WIRE-992014',
      authCode: 'AUTH-ACH-8911'
    },
    orderStatus: 'stress_testing',
    shippingSpeed: 'white_glove',
    trackingNumber: '1Z992A01038291039',
    carrier: 'FedEx Custom Critical',
    estimatedDelivery: '2026-11-12',
    timeline: [
      {
        status: 'pending',
        timestamp: '2026-11-08T18:42:00Z',
        title: 'Order Authorized',
        description: 'Wire transfer received and verified by risk engine.'
      },
      {
        status: 'assembling',
        timestamp: '2026-11-08T20:15:00Z',
        title: 'Clean-Room Assembly Complete',
        description: 'Threadripper seated and dual 4090 PCIe riser validated.'
      },
      {
        status: 'stress_testing',
        timestamp: '2026-11-09T02:00:00Z',
        title: '24-Hour Prime95 & FurMark Soak Test',
        description: 'VRAM and CPU thermals operating at 58C stable under 100% load.'
      }
    ]
  },
  {
    id: 'ORD-89215',
    createdAt: '2026-11-07T14:20:00Z',
    customer: {
      fullName: 'Dr. Elena Rostova',
      companyName: 'BioSynthetica Research',
      email: 'e.rostova@biosynthetica.de',
      phone: '+49 30 9928120',
      address: 'Friedrichstraße 140',
      city: 'Berlin',
      state: 'Berlin',
      zipCode: '10117',
      country: 'Germany'
    },
    items: [
      {
        productId: 'pc-studio-creator',
        productName: 'Precision Studio Pro 14900KS',
        price: 3799,
        quantity: 2,
        specsSummary: 'Core i9-14900KS · RTX 4080 Super · 96GB DDR5',
        warranty: '3-Year Advanced Hardware',
        image: '/src/assets/images/product_studio_workstation_1794212402879.jpg'
      }
    ],
    subtotal: 7598,
    discount: 200,
    tax: 0,
    shipping: 120,
    total: 7518.00,
    paymentMethod: 'credit_card',
    paymentStatus: 'captured',
    paymentDetails: {
      last4: '4242',
      brand: 'Visa Business Platinum',
      transactionId: 'TXN-STRIPE-881920',
      authCode: 'AUTH-V-30918'
    },
    orderStatus: 'shipped',
    shippingSpeed: 'expedited_air',
    trackingNumber: 'DHL-EX-849102849',
    carrier: 'DHL Express Worldwide',
    estimatedDelivery: '2026-11-10',
    timeline: [
      {
        status: 'pending',
        timestamp: '2026-11-07T14:20:00Z',
        title: 'Payment Confirmed',
        description: 'Visa Business transaction passed 3D Secure verification.'
      },
      {
        status: 'assembling',
        timestamp: '2026-11-07T16:00:00Z',
        title: 'Assembly & Custom Cabling',
        description: 'Twin systems constructed and firmware flashed.'
      },
      {
        status: 'stress_testing',
        timestamp: '2026-11-08T08:00:00Z',
        title: 'QA Certification Passed',
        description: 'Zero memory errors detected on 96GB DDR5 memory test.'
      },
      {
        status: 'shipped',
        timestamp: '2026-11-08T16:30:00Z',
        title: 'Dispatched via Air Freight',
        description: 'Loaded onto flight LH402 with shock telemetry loggers attached.'
      }
    ]
  },
  {
    id: 'ORD-89190',
    createdAt: '2026-11-06T10:11:00Z',
    customer: {
      fullName: 'Jason Sterling',
      email: 'j.sterling@gmail.com',
      phone: '+1 (512) 441-9023',
      address: '2204 Barton Springs Rd',
      city: 'Austin',
      state: 'TX',
      zipCode: '78704',
      country: 'United States'
    },
    items: [
      {
        productId: 'pc-apex-one',
        productName: 'Apex-Liquid Extreme 9950X',
        price: 4899,
        quantity: 1,
        specsSummary: 'Ryzen 9 9950X · RTX 4090 · 64GB DDR5 · Hardline Loop',
        warranty: '3-Year On-Site White Glove',
        image: '/src/assets/images/hero_custom_workstation_1794212401925.jpg'
      }
    ],
    subtotal: 4899,
    discount: 100,
    tax: 395.92,
    shipping: 0,
    total: 5194.92,
    paymentMethod: 'apple_pay',
    paymentStatus: 'captured',
    paymentDetails: {
      last4: '9912',
      brand: 'Apple Pay (Mastercard)',
      transactionId: 'TXN-APAY-441829',
      authCode: 'AUTH-AP-55291'
    },
    orderStatus: 'delivered',
    shippingSpeed: 'white_glove',
    trackingNumber: '1Z88290192837461',
    carrier: 'UPS Premium Freight',
    estimatedDelivery: '2026-11-08',
    timeline: [
      {
        status: 'delivered',
        timestamp: '2026-11-08T14:15:00Z',
        title: 'Delivered & Signature Captured',
        description: 'Wooden crate signed for and uncrated in residence.'
      }
    ]
  },
  {
    id: 'ORD-89120',
    createdAt: '2026-11-05T09:05:00Z',
    customer: {
      fullName: 'Chloe Dupont',
      companyName: 'Lumiere Studios Paris',
      email: 'c.dupont@lumiere.fr',
      phone: '+33 1 42 68 55 00',
      address: '18 Rue de la Paix',
      city: 'Paris',
      state: 'IDF',
      zipCode: '75002',
      country: 'France'
    },
    items: [
      {
        productId: 'pc-creator-laptop-16',
        productName: 'TitanWorks StudioBook 16 Pro',
        price: 3299,
        quantity: 1,
        specsSummary: 'Ultra 9 185H · RTX 4080 Mobile · 64GB · 4K OLED',
        warranty: '2-Year Global Protection',
        image: '/src/assets/images/product_creator_laptop_1794212405122.jpg'
      }
    ],
    subtotal: 3299,
    discount: 0,
    tax: 0,
    shipping: 65,
    total: 3364.00,
    paymentMethod: 'credit_card',
    paymentStatus: 'captured',
    paymentDetails: {
      last4: '1084',
      brand: 'Mastercard World Elite',
      transactionId: 'TXN-MC-301982',
      authCode: 'AUTH-MC-8819'
    },
    orderStatus: 'delivered',
    shippingSpeed: 'expedited_air',
    trackingNumber: 'FDX-INT-7729180',
    carrier: 'FedEx International Priority',
    estimatedDelivery: '2026-11-07',
    timeline: [
      {
        status: 'delivered',
        timestamp: '2026-11-07T11:40:00Z',
        title: 'Signed and Delivered',
        description: 'Package delivered to studio reception desk.'
      }
    ]
  }
];
