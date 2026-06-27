// Automatic eligibility verification helper
export const getParticipantVerification = (p: any) => {
  if (p.subscription_status !== 'active') {
    return { status: 'failed', reason: 'Subscription expired' };
  }
  if (p.payment_status !== 'paid') {
    if (p.payment_status === 'unpaid') return { status: 'failed', reason: 'Payment incomplete' };
    if (p.payment_status === 'reversed' || p.payment_status === 'refunded') return { status: 'failed', reason: `Payment ${p.payment_status}` };
    return { status: 'failed', reason: 'Payment incomplete' };
  }
  if (p.weekly_entry_status !== 'valid') {
    return { status: 'failed', reason: 'Invalid weekly participation' };
  }
  if (p.account_status !== 'active') {
    return { status: 'failed', reason: 'Account suspended' };
  }
  if (p.is_duplicate) {
    return { status: 'failed', reason: 'Duplicate entry' };
  }
  return { status: 'verified', reason: '' };
};

// Helper to generate 1,000 mock participants for weekly draw selection
export const generateMockParticipants = () => {
  const plans = ['Silver Plan', 'Gold Plan', 'Platinum Plan'];
  const list = [];
  
  // Specific mock participants (first 10 items) to match user disputes/stories
  const specific = [
    {
      id: '1',
      name: 'Amit Sen',
      email: 'amit.sen@example.com',
      phone: '+91 9830012345',
      plan: 'Silver Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: ''
    },
    {
      id: '2',
      name: 'Sonia Das',
      email: 'sonia.das@example.com',
      phone: '+91 9830067890',
      plan: 'Gold Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: ''
    },
    {
      id: '3',
      name: 'Rahul Sen', // This is the logged-in customer in our simulator
      email: 'rahul.sen@example.com',
      phone: '+91 9876543210',
      plan: 'Silver Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: ''
    },
    {
      id: '4',
      name: 'Vikram Singh',
      email: 'vikram.s@example.com',
      phone: '+91 9903344556',
      plan: 'Platinum Plan',
      subscription_status: 'active',
      payment_status: 'unpaid', // Verification failed: Payment incomplete
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'failed',
      verification_reason: 'Payment incomplete'
    },
    {
      id: '5',
      name: 'Riya Dutta',
      email: 'riya.d@example.com',
      phone: '+91 9831122334',
      plan: 'Gold Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: ''
    },
    {
      id: '6',
      name: 'Subhash Bose',
      email: 'subhash@example.com',
      phone: '+91 9433011223',
      plan: 'Silver Plan',
      subscription_status: 'expired', // Verification failed: Subscription expired
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'failed',
      verification_reason: 'Subscription expired'
    },
    {
      id: '7',
      name: 'Pooja Banerjee',
      email: 'pooja.b@example.com',
      phone: '+91 9830099887',
      plan: 'Platinum Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: ''
    },
    {
      id: '8',
      name: 'Kunal Ghosh',
      email: 'kunal.g@example.com',
      phone: '+91 9051122334',
      plan: 'Silver Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: true, // Verification failed: Duplicate entry
      ticketId: '',
      status: 'failed',
      verification_reason: 'Duplicate entry'
    },
    {
      id: '9',
      name: 'Ananya Roy',
      email: 'ananya@example.com',
      phone: '+91 9830022334',
      plan: 'Gold Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'invalid', // Verification failed: Invalid weekly participation
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'failed',
      verification_reason: 'Invalid weekly participation'
    },
    {
      id: '10',
      name: 'Debasish Sen',
      email: 'debasish@example.com',
      phone: '+91 9830055443',
      plan: 'Platinum Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'suspended', // Verification failed: Account suspended
      is_duplicate: false,
      ticketId: '',
      status: 'failed',
      verification_reason: 'Account suspended'
    }
  ];
  
  list.push(...specific);
  
  // Generate 990 more to make 1000 total participants
  const firstNames = ['Amit', 'Sonia', 'Rahul', 'Vikram', 'Riya', 'Subhash', 'Pooja', 'Kunal', 'Ananya', 'Debasish', 'Sajal', 'Rita', 'Jayanta', 'Mousumi', 'Arnab', 'Tania', 'Pradip', 'Indranil', 'Sujata', 'Koushik', 'Sharmistha', 'Niladri', 'Paramita', 'Snehasis', 'Supriya'];
  const lastNames = ['Sen', 'Das', 'Singh', 'Dutta', 'Bose', 'Banerjee', 'Ghosh', 'Roy', 'Choudhury', 'Bhattacharya', 'Mukherjee', 'Chatterjee', 'Ganguly', 'Mitra', 'Sarkar', 'Pramanik', 'Adhikary', 'Chakraborty', 'Maitra', 'Halder', 'Pal', 'Naskar', 'Mondal', 'Mallick'];
  
  for (let i = 11; i <= 1000; i++) {
    const fName = firstNames[(i * 7) % firstNames.length];
    const lName = lastNames[(i * 13) % lastNames.length];
    const name = `${fName} ${lName}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`;
    const phone = `+91 98${(i * 17) % 10}${(i * 29) % 10}${String(100000 + (i * 101) % 900000)}`;
    const plan = plans[i % plans.length];
    
    // Most should be verified, a small fraction fail
    let subscription_status: 'active' | 'expired' = 'active';
    let payment_status: 'paid' | 'unpaid' | 'reversed' | 'refunded' = 'paid';
    let weekly_entry_status: 'valid' | 'invalid' = 'valid';
    let account_status: 'active' | 'suspended' = 'active';
    let is_duplicate = false;
    
    // Introduce failures systematically at specific offsets
    if (i === 101) subscription_status = 'expired';
    else if (i === 202) payment_status = 'unpaid';
    else if (i === 303) weekly_entry_status = 'invalid';
    else if (i === 404) account_status = 'suspended';
    else if (i === 505) is_duplicate = true;
    else if (i === 606) payment_status = 'reversed';
    else if (i === 707) payment_status = 'refunded';
    
    const verification = getParticipantVerification({
      subscription_status,
      payment_status,
      weekly_entry_status,
      account_status,
      is_duplicate
    });
    
    list.push({
      id: String(i),
      name,
      email,
      phone,
      plan,
      subscription_status,
      payment_status,
      weekly_entry_status,
      account_status,
      is_duplicate,
      ticketId: '',
      status: verification.status,
      verification_reason: verification.reason
    });
  }
  
  return list;
};

export const generateRandomToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 10; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

export const exportToCSV = (verificationLogs: any, participants: any[], selectedWinners: any[]) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "BEDUINE TOUR & TRAVELS - WEEKLY SELECTION RESULTS REPORT\n";
  csvContent += `Execution Date/Time,${verificationLogs?.timestamp || new Date().toLocaleString()}\n`;
  csvContent += `Verification Hash,${verificationLogs?.hash || 'N/A'}\n`;
  csvContent += `Total Eligible Participants (N),${verificationLogs?.totalN || 0}\n`;
  csvContent += `Selected Winners Count (ROUNDUP N * 5%),${verificationLogs?.selectedK || 0}\n\n`;
  
  csvContent += "Participant ID,Name,Email,Phone,Plan,Ticket ID,Selection Status,Winner Coupon (UUID)\n";
  participants.forEach((p) => {
    const isWinner = selectedWinners.some(w => w.id === p.id);
    const coupon = isWinner ? selectedWinners.find(w => w.id === p.id).coupon : '';
    csvContent += `"${p.id}","${p.name}","${p.email}","${p.phone}","${p.plan}","${p.ticketId || 'N/A'}","${isWinner ? 'WINNER' : 'NOT SELECTED'}","${coupon}"\n`;
  });
  
  csvContent += "\n\nLEGAL NOTICE: Selection-based promotional module will remain disabled in production until the client provides approved rules, eligibility criteria, privacy terms and written legal authorization.\n";
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Beduine_Selection_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (verificationLogs: any, participants: any[], selectedWinners: any[], cycleState: string, notificationLogs: string[]) => {
  let content = "";
  content += "=========================================================================\n";
  content += "           BEDUINE TOUR & TRAVELS - WEEKLY SELECTION REPORT               \n";
  content += "=========================================================================\n\n";
  content += `Report Generated: ${new Date().toLocaleString()}\n`;
  content += `Verification Security Hash: ${verificationLogs?.hash || 'N/A'}\n`;
  content += `Cycle Status: ${cycleState.toUpperCase()}\n\n`;
  
  content += "-------------------------------------------------------------------------\n";
  content += "SELECTION METRICS & RATIOS\n";
  content += "-------------------------------------------------------------------------\n";
  content += `Total Registered Candidates: ${participants.length}\n`;
  content += `Eligible Participant Count (N): ${verificationLogs?.totalN || 0}\n`;
  content += `Selected Count (ROUNDUP(N * 5%, 0)): ${verificationLogs?.selectedK || 0}\n\n`;
  
  content += "-------------------------------------------------------------------------\n";
  content += "WINNER LIST & VERIFIED COUPONS\n";
  content += "-------------------------------------------------------------------------\n";
  if (selectedWinners.length === 0) {
    content += "No winners selected in this cycle.\n";
  } else {
    selectedWinners.forEach((w, idx) => {
      content += `${idx + 1}. Name: ${w.name}\n`;
      content += `   Ticket ID: ${w.ticketId}\n`;
      content += `   Coupon UUID: ${w.coupon}\n`;
      content += `   Contact: ${w.phone} | ${w.email}\n\n`;
    });
  }
  
  content += "-------------------------------------------------------------------------\n";
  content += "NOTIFICATION DESPATCH LOGS\n";
  content += "-------------------------------------------------------------------------\n";
  notificationLogs.forEach((log) => {
    content += `[LOG] ${log}\n`;
  });
  
  content += "\n-------------------------------------------------------------------------\n";
  content += "LEGAL NOTICE / CONTRACTUAL RESTRICTION\n";
  content += "-------------------------------------------------------------------------\n";
  content += "Selection-based promotional module will remain disabled in production\n";
  content += "until the client provides approved rules, eligibility criteria, privacy\n";
  content += "terms and written legal authorization.\n\n";
  content += "=========================================================================\n";
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Beduine_Selection_Report_${new Date().toISOString().slice(0, 10)}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
