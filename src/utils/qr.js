import QRCode from 'qrcode'

// With async/await
const generateQR = async (text, opt) => {
  try {
    let qr = await QRCode.toDataURL(text, opt);
    return qr
  } catch (err) {
    console.error(err.message)
  }
}

export default generateQR;