const BASE_V2 = 'https://www.rumahotp.io/api/v2'
const BASE_V1 = 'https://www.rumahotp.io/api/v1'

export function getHeaders() {
  return {
    'x-apikey': process.env.RUMAHOTP_API_KEY!,
    'Content-Type': 'application/json',
  }
}

export async function rumahFetch(url: string) {
  const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`RumahOTP error ${res.status}: ${text}`)
  }
  return res.json()
}

export const ENDPOINTS = {
  services: () => `${BASE_V2}/services`,
  countries: (serviceId: string) => `${BASE_V2}/countries?service_id=${serviceId}`,
  operators: (country: string, providerId: string) =>
    `${BASE_V2}/operators?country=${encodeURIComponent(country)}&provider_id=${providerId}`,
  order: (numberId: string, providerId: string, operatorId: string) =>
    `${BASE_V2}/orders?number_id=${numberId}&provider_id=${providerId}&operator_id=${operatorId}`,
  orderStatus: (orderId: string) =>
    `${BASE_V1}/orders/get_status?order_id=${orderId}`,
  cancelOrder: (orderId: string) =>
    `${BASE_V1}/orders/set_status?order_id=${orderId}&status=cancel`,
  depositCreate: (amount: string) =>
    `${BASE_V2}/deposit/create?amount=${amount}&payment_id=qris`,
  depositStatus: (depositId: string) =>
    `${BASE_V2}/deposit/get_status?deposit_id=${depositId}`,
  depositCancel: (depositId: string) =>
    `${BASE_V1}/deposit/cancel?deposit_id=${depositId}`,
  h2hProduct: () => `${BASE_V1}/h2h/product`,
  h2hCreate: (target: string, id: string) =>
    `${BASE_V1}/h2h/transaksi/create?target=${target}&id=${id}`,
  h2hStatus: (transaksiId: string) =>
    `${BASE_V1}/h2h/transaksi/status?transaksi_id=${transaksiId}`,
  adminBalance: () => `${BASE_V1}/user/balance`,
}
