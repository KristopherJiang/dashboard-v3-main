async function test() {
  const token = 'ST0_ku78zgJi_xLibVBEFrw1yMB';
  const url = `https://api.sensortower.com/v1/ios/sales_report_estimates?auth_token=${token}&app_ids=1359763701&start_date=2026-05-01&end_date=2026-05-15`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Exness returned entries:', data.length);
    console.log('Sample Exness entries (first 3):', data.slice(0, 3));
  } catch(err) {
    console.error('Error:', err);
  }
}
test();
