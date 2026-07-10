/** แปลงจำนวนเงินเป็นคำอ่านไทย — mirror ของ Go package bahttext (logic เดียวกัน) */
const DIGITS = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const PLACES = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];

function belowMillion(n: number, hasHigher: boolean): string {
  let out = '';
  for (let place = 5; place >= 0; place--) {
    const d = Math.floor(n / 10 ** place) % 10;
    if (d === 0) continue;
    if (place === 0 && d === 1 && hasHigher) out += 'เอ็ด';
    else if (place === 1 && d === 1) out += 'สิบ';
    else if (place === 1 && d === 2) out += 'ยี่สิบ';
    else out += DIGITS[d] + PLACES[place];
    hasHigher = true;
  }
  return out;
}

function readNumber(n: number): string {
  if (n === 0) return '';
  const million = Math.floor(n / 1_000_000);
  return (million > 0 ? readNumber(million) + 'ล้าน' : '') + belowMillion(n % 1_000_000, million > 0);
}

export function bahtText(amount: number): string {
  let satang = Math.round(Math.abs(amount) * 100);
  const prefix = amount < 0 ? 'ลบ' : '';
  const baht = Math.floor(satang / 100);
  satang %= 100;
  if (baht === 0 && satang === 0) return 'ศูนย์บาทถ้วน';
  let out = prefix;
  if (baht > 0 || satang === 0) out += readNumber(baht) + 'บาท';
  out += satang === 0 ? 'ถ้วน' : readNumber(satang) + 'สตางค์';
  return out;
}
