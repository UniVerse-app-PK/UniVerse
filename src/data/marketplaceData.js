export const categories = ['All', 'Books', 'Electronics', 'Furniture', 'Clothes', 'Cycles', 'Sports', 'Wearables', 'Instruments', 'Misc'];

export const listings = [
  {
    id: '1',
    name: 'Engineering Mathematics',
    price: 'Rs. 650',
    category: 'Books',
    condition: 'Good condition',
    location: 'NUST, H-12',
    seller: 'Amarah',
    sellerRating: { score: 4.8, count: 12 },
    sellerDescription: 'Senior engineering student cleaning out my bookshelf. Mostly textbooks and notes from first two years.',
    sellerPhone: '+92 312 3456789',
    description: 'Used only for 1 semester. Good condition, original book. Minimal highlights, all pages intact.',
    status: 'active',
    views: 45,
    photos: [
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60'
    ],
    reviews: [
      { id: 'r1', user: 'Zainab', score: 5, comment: 'Book was in perfect shape as described. Highly recommended!', date: '2 days ago' },
      { id: 'r2', user: 'Hafza', score: 4.5, comment: 'Friendly seller, prompt response and easy meetup.', date: '1 week ago' }
    ]
  },
  {
    id: '2',
    name: 'Thinkpad T470',
    price: 'Rs. 45,000',
    category: 'Electronics',
    condition: 'Fair condition',
    location: 'NUST, H-12',
    seller: 'Kavindu',
    sellerRating: { score: 4.5, count: 8 },
    sellerDescription: 'Tech enthusiast who loves upgrading machines. Reliable and clear communication.',
    sellerPhone: '+92 300 9876543',
    description: 'Reliable laptop for coding and coursework. Battery health 80%. Comes with original charger.',
    status: 'active',
    views: 60,
    photos: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60'
    ],
    reviews: [
      { id: 'r1', user: 'Usman', score: 4.5, comment: 'Good deal. The laptop runs smoothly and setup was quick.', date: '5 days ago' }
    ]
  },
  {
    id: '3',
    name: 'Calculus Book',
    price: 'Rs. 500',
    category: 'Books',
    condition: 'Good condition',
    location: 'UET, Taxila',
    seller: 'Amna',
    sellerRating: { score: 4.6, count: 5 },
    sellerDescription: 'Pre-med sophomore. Selling old study materials.',
    sellerPhone: '+92 333 1122334',
    description: 'Stewart Calculus, minimal highlighting. Perfect for first-year engineering or math courses.',
    status: 'active',
    views: 22,
    photos: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60'
    ],
    reviews: []
  },
  {
    id: '4',
    name: 'Thinkpad T480',
    price: 'Rs. 85,000',
    category: 'Electronics',
    condition: 'Like new',
    location: 'NUST, H-12',
    seller: 'Namra',
    sellerRating: { score: 4.7, count: 20 },
    sellerDescription: 'Official tech hub representative. Reliable and quick service.',
    sellerPhone: '+92 321 5556677',
    description: 'Barely used, comes with charger and sleeve. Perfect battery timing and pristine body.',
    status: 'active',
    views: 45,
    photos: [
      'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500&auto=format&fit=crop&q=60'
    ],
    reviews: [
      { id: 'r1', user: 'Sara', score: 5, comment: 'Product is literally like new. Very honest seller!', date: '3 days ago' }
    ]
  },
  {
    id: '6',
    name: 'Hostel Refrigerator',
    price: 'Rs. 5,000',
    category: 'Furniture',
    condition: 'Fair condition',
    location: 'COMSATS',
    seller: 'Ahmed',
    sellerRating: { score: 4.2, count: 3 },
    sellerDescription: 'Final year student graduating and selling room furniture.',
    sellerPhone: '+92 345 7778899',
    description: 'Mini fridge, works fine, minor scratches. Keeps drinks and food perfectly cold.',
    status: 'active',
    views: 30,
    photos: [
      'https://images.unsplash.com/photo-1571843439991-dd2b8e051966?w=500&auto=format&fit=crop&q=60'
    ],
    reviews: [
      { id: 'r1', user: 'Ali', score: 4, comment: 'A bit dusty but functional. Good price.', date: '3 weeks ago' }
    ]
  },
  {
    id: '7',
    name: 'Oneplus 15',
    price: 'Rs. 180,000',
    category: 'Electronics',
    condition: 'Like new',
    location: 'FAST, Islamabad',
    seller: 'Sarah',
    sellerRating: { score: 4.9, count: 15 },
    sellerDescription: 'BS Cyber Security student. Love changing phones often.',
    sellerPhone: '+92 300 1234567',
    description: '6 months old, box and accessories included. No scratches or dents.',
    status: 'active',
    views: 70,
    photos: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60'
    ],
    reviews: [
      { id: 'r1', user: 'Bilal', score: 5, comment: 'Excellent communication and original product.', date: '1 month ago' }
    ]
  }
];

