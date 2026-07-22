import JSEncrypt from 'jsencrypt'

let cachedPublicKey = null

async function getPublicKey() {
  if (cachedPublicKey) return cachedPublicKey
  const { default: request } = await import('./index')
  const res = await request.get('/auth/public-key')
  cachedPublicKey = res.publicKey
  return cachedPublicKey
}

export async function rsaEncrypt(text) {
  const publicKey = await getPublicKey()
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  const result = encrypt.encrypt(text)
  if (!result) throw new Error('RSA encryption failed')
  return result
}
