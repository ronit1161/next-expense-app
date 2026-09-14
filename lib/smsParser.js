/**
 * Smart SMS & UPI Bank Transaction Parser
 * Parses single or multi-line bank alert SMS (HDFC, SBI, ICICI, Axis, GPay, PhonePe, Paytm, etc.)
 */

// Category Keyword Mapping (maps merchant/keywords to category name)
const CATEGORY_RULES = [
  {
    categoryName: 'Food',
    categoryId: 1,
    keywords: [
      'swiggy', 'zomato', 'starbucks', 'mcdonald', 'kfc', 'burger', 'pizza',
      'dominos', 'chai', 'cafe', 'restaurant', 'dhaba', 'bakery', 'eats',
      'kitchen', 'food', 'biryani', 'tea', 'coffee', 'hotel', 'dining', 'bar'
    ],
  },
  {
    categoryName: 'Travel',
    categoryId: 2,
    keywords: [
      'uber', 'ola', 'rapido', 'metro', 'irctc', 'rail', 'flight', 'indigo',
      'petrol', 'fuel', 'hpcl', 'bpcl', 'iocl', 'shell', 'fastag', 'toll',
      'parking', 'auto', 'cab', 'bus', 'redbus', 'makemytrip', 'cleartrip'
    ],
  },
  {
    categoryName: 'Shopping',
    categoryId: 3,
    keywords: [
      'amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'ajio', 'meesho', 'nykaa',
      'blinkit', 'zepto', 'instamart', 'bigbasket', 'dmart', 'supermarket',
      'groceries', 'mart', 'retail', 'cloth', 'apparel', 'store', 'mall'
    ],
  },
  {
    categoryName: 'Entertainment',
    categoryId: 4,
    keywords: [
      'netflix', 'spotify', 'bookmyshow', 'prime', 'hotstar', 'pvr', 'inox',
      'cinema', 'movie', 'game', 'playstation', 'steam', 'youtube', 'disney', 'event'
    ],
  },
  {
    categoryName: 'Bills',
    categoryId: 5,
    keywords: [
      'electricity', 'bescom', 'tneb', 'adani', 'water', 'gas', 'airtel',
      'jio', 'vi', 'broadband', 'wifi', 'recharge', 'bill', 'maintenance', 'rent', 'tatasky', 'dth'
    ],
  },
  {
    categoryName: 'Medical',
    categoryId: 6,
    keywords: [
      'apollo', 'pharmeasy', '1mg', 'medplus', 'hospital', 'clinic', 'pharmacy',
      'doctor', 'chemist', 'lab', 'health', 'diagnostics', 'dental'
    ],
  },
  {
    categoryName: 'Education',
    categoryId: 7,
    keywords: [
      'udemy', 'coursera', 'college', 'school', 'university', 'books', 'tuition',
      'course', 'exam', 'fees', 'institute', 'class'
    ],
  },
];

/**
 * Clean & normalize merchant string
 */
function cleanMerchant(str) {
  if (!str) return 'Bank Transaction';
  let cleaned = str
    .replace(/^[\s\-:\.]+|[\s\-:\.]+$/g, '')
    .replace(/\b(VPA|UPI|REF|NO|TXN|IMPS|NEFT|PVT|LTD|CARD|ENDING|XX\d+)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (!cleaned || cleaned.length < 2) return 'UPI / Card Payment';
  // Capitalize words
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Detect category based on merchant name and SMS body
 */
export function detectCategory(text, merchant = '') {
  const fullContent = `${merchant} ${text}`.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (fullContent.includes(kw)) {
        return {
          categoryId: rule.categoryId,
          categoryName: rule.categoryName,
        };
      }
    }
  }

  // Fallback to Others (ID 8)
  return {
    categoryId: 8,
    categoryName: 'Others',
  };
}

/**
 * Detect payment method
 */
export function detectPaymentMethod(text) {
  const lower = text.toLowerCase();
  if (lower.includes('upi') || lower.includes('vpa') || lower.includes('gpay') || lower.includes('phonepe') || lower.includes('paytm')) {
    return 'UPI';
  }
  if (lower.includes('credit card') || lower.includes('credit') || lower.includes('card ending')) {
    return 'CREDIT_CARD';
  }
  if (lower.includes('debit card') || lower.includes('debit') || lower.includes('atm')) {
    return 'DEBIT_CARD';
  }
  if (lower.includes('netbanking') || lower.includes('neft') || lower.includes('imps') || lower.includes('rtgs')) {
    return 'NET_BANKING';
  }
  return 'UPI'; // Default for most digital payments in India
}

/**
 * Parse a single SMS message string
 */
export function parseSingleSms(smsText) {
  if (!smsText || typeof smsText !== 'string') return null;

  const trimmed = smsText.trim();
  if (trimmed.length < 10) return null;

  // 1. Check if it's a debit/spend transaction
  const lower = trimmed.toLowerCase();
  const isDebit =
    lower.includes('debited') ||
    lower.includes('spent') ||
    lower.includes('paid') ||
    lower.includes('sent') ||
    lower.includes('transferred') ||
    lower.includes('deducted') ||
    lower.includes('txn of') ||
    lower.includes('purchase of') ||
    lower.includes('payment of') ||
    lower.includes('vpa');

  // If SMS mentions credited/received only, skip unless spent is also mentioned
  if (!isDebit && (lower.includes('credited') || lower.includes('received rs'))) {
    return null;
  }

  // 2. Extract Amount
  // Matches: "Rs. 450.00", "Rs 1,200", "INR 499.50", "₹350", "debited by 500"
  const amountRegex = /(?:rs\.?|inr|inr\.|₹)\s*([0-9,]+(?:\.[0-9]{1,2})?)|debited(?:\s+by)?\s*(?:rs\.?|inr|₹)?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i;
  const amountMatch = trimmed.match(amountRegex);

  let amount = null;
  if (amountMatch) {
    const rawVal = (amountMatch[1] || amountMatch[2] || '').replace(/,/g, '');
    const num = parseFloat(rawVal);
    if (!isNaN(num) && num > 0) {
      amount = num;
    }
  }

  if (!amount) return null;

  // 3. Extract Merchant / Beneficiary
  // Patterns: "to <merchant>", "at <merchant>", "info: <merchant>", "VPA <merchant>"
  let merchant = '';
  const merchantPatterns = [
    /(?:at|to|info|vpa|paid to)\s+([A-Za-z0-9\s\.\-_&]{2,30}?)(?:\s+on|\s+ref|\s+upi|\s+avl|\s+via|\s+balance|\s+from|\.|\n|$)/i,
    /(?:purchase at|spent on)\s+([A-Za-z0-9\s\.\-_&]{2,30}?)(?:\s+on|\s+ref|\s+upi|\.|\n|$)/i,
    /towards\s+([A-Za-z0-9\s\.\-_&]{2,30}?)(?:\s+on|\s+ref|\.|\n|$)/i,
  ];

  for (const regex of merchantPatterns) {
    const m = trimmed.match(regex);
    if (m && m[1]) {
      merchant = cleanMerchant(m[1]);
      break;
    }
  }

  if (!merchant) {
    merchant = 'UPI Merchant';
  }

  // 4. Extract Date (or default today)
  let expenseDate = new Date().toISOString().split('T')[0];
  const dateRegex = /(\d{1,2})[-/.](\d{1,2}|[A-Za-z]{3})[-/.](\d{2,4})/;
  const dateMatch = trimmed.match(dateRegex);

  if (dateMatch) {
    try {
      const parsedDate = new Date(dateMatch[0]);
      if (!isNaN(parsedDate.getTime())) {
        expenseDate = parsedDate.toISOString().split('T')[0];
      }
    } catch {
      // fallback to today
    }
  }

  // 5. Detect Category & Payment Method
  const category = detectCategory(trimmed, merchant);
  const paymentMethod = detectPaymentMethod(trimmed);

  return {
    id: `parsed-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    amount,
    description: merchant,
    categoryId: category.categoryId,
    categoryName: category.categoryName,
    paymentMethod,
    expenseDate,
    rawSms: trimmed,
  };
}

/**
 * Parse bulk text (multiple SMS messages pasted together)
 */
export function parseBulkSms(bulkText) {
  if (!bulkText || typeof bulkText !== 'string') return [];

  // Split by double newline or common bank signature markers
  const chunks = bulkText
    .split(/\n\s*\n|\r\n\s*\r\n|(?=\b(?:Dear\s+Customer|Sent\s+Rs|Debited\s+by|Rs\.?\s*\d+|Your\s+A\/c|Acct\s+xx)\b)/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  const results = [];
  const seenSignatures = new Set();

  for (const chunk of chunks) {
    const parsed = parseSingleSms(chunk);
    if (parsed) {
      // Avoid duplicate entries in the same paste
      const sig = `${parsed.amount}-${parsed.description}-${parsed.expenseDate}`;
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        results.push(parsed);
      }
    }
  }

  return results;
}
