const firebase = require('firebase');
require('firebase/firestore');
// let firebaseConfig = {
//   "type": "service_account",
//   "project_id": "quickstart-1588594831516",
//   "private_key_id": "f8b8759ce84c3170758f504b82c685444212eacb",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCziCYx8jJbvPYk\nhwW2QOA3iYDRH4KGGgdpQV43gQuzDBzNAg0o9dYSah0E/b+qNjlpXZKpKl+ohb+b\nCVjTwUhFEbGLXPCObuqftl947VR024M8rqpKRZ8c20SSgfARy9ZVwVRuwnpTMw9X\nwd9+6EbqiEod8lr4TpZ3eJHFLO9Eex7Vp6tR/0pK57isLxyAnuuqeAZPGARp4iOD\nHDeM9UViAGcOBmQk7czQTr7fw2Clj10WnOkhgEwLC28928QVVkRCZSkJKsiNU/l8\n30Cr/rNqpe2ZgxXwedalSs75Z3vEImJKB6HecDMFcVP9ObZkOaClzPmrXu5paGWj\nSrC5IJ6LAgMBAAECggEAC3TGqy0/VWdLda1ACg89v42AsNeH5rLGgkrvji8n5fcB\n53sYB+MYE/i9fVIL5vqq0zRrZWwUypYuUeBY0LpmuDGW2MPHfe9J/YMPuJG8b/CK\nAVdL+o1Sx+6eA5NTFG+jb7l0f9TdJW3+rqTqdBiyXcjwodSTRYEOTPVep+xkIER3\nWtBcl7b7eoJtuiY/0AbjX01AncvhJlA0xbLHJMsrt7BWXIPIBnyco3q3lF/4Cy1N\nTeVYxA48oDNfcX5HcOKiNK6E84BT6KBh62hKph0XaTvPL3HQk7pfrTabmhmwj92U\nWNdryb2N8kdlaSWY1Cly9+ewn63L387UfCjZq8f6EQKBgQD44oJqXRNA83Hzk3Ve\n1NoDwIjAZ8VhJdD3dEOLZz/6IV4tX9eVbGGDNU0FaWrbfVgBH9A2/zXMnMP7N1Fy\nBcrpvsWDrsRC8Hf7Y1Uf3E6nTug1SDHX79faMGRnMqVi2tocOLaC0HqWcxHELdMl\nxcT0eLZtPjdBYYamzgTR0rnK/wKBgQC4qhKO8IpjHREeT/FTgfpSanKFv2Fk0KfQ\n+fA/8iVodeMcH2vd4r9Fj0r+sMWznDJuvq/iaGG3uLdgI5K2A6oEPki+U9VbUO9s\n6UoYGA80Ps27i+ZcJepg38N2jAkQ268Z957yqfmMa9knON+G1uD0FO3enX0otXGV\nBim46IEodQKBgQC1HcDiPlFglsh6BPkIxcTRri7WNa4BgE+NhGIS9FQuZlHumyx7\nZJ+hqAwgwBIvIAwG5WvUWeyAtiQ4kI0IeQatC1MY/Pl97RijLCoqQVxLjLSW8a60\nAaoG8ehe4RBR3AmVOAA5OhW7nolzRhW+CynE7oNzBC+ZuKsQgCQpvTvPaQKBgGxI\n3oUPLDceblFWE28igsUdQnaHWPcjG6UBSw5UUfdFWZ2+FySPuBV0B0f+JJBEAZbL\nHpwnFVYEbRNlCLzOvT2rwEBLLItVlHBLBHXIdfHu+fkF+lkCqsOPszCqwQ4vpCgX\n+g7V+U2MWFQVl42cJ2E5fJrTwvbCHw6CBKk3PbWZAoGAQYTrNdeF+pnczP/iOOOh\nxD43O7iD6lO1unpVhRWPsSH1S57/rZZD6QOBtWtio39gA1mxiexuwwek7HITDf6z\naF7xJIZmrG7FoGMUhgkAzJnO5xJpi3twfRpoK/XO7pSL/ofo0y25Pa2+elvu60dZ\nJFE5Xoag9lD4mmSvRAid9mA=\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk-p4vxt@quickstart-1588594831516.iam.gserviceaccount.com",
//   "client_id": "104182960927988919857",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-p4vxt%40quickstart-1588594831516.iam.gserviceaccount.com"
// };

var firebaseConfig = {
    "type": "service_account",
    "project_id": "fitazfk-app",
    "private_key_id": "5d24c93044596aacff929dde436e408db4c9b6fc",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIUnwWKVToIZ+L\nKgQ7bN/jTa9HoigCVv1CX0kavw4K2fRKCa0rNgzp9haY/2BpJ4VvqQyDX0YhcO07\nBN8HO3mU+Y8clPVbU7QJQw1ktubYTsu+2tPo4isfOGB7ldqkr4yMJ9EooVqWYFP1\nQb6EqI/2Gxu93zJg4f0+C9aX2ASeYjAppMAFsZXl66vQbOAj6ME1kmGIt4hZOgcN\nb8csEKqmuGE+mMP3u3cYHvnc9xEGkWz8rIDseZxnFyFhWZjeYuJTG85gtS2QaWbA\ncrIKp1QwKV4iYik8/e1iU2utN1Ui/BUMzWtdJhwPc5XdDsUpDZGxdb0BnPAWKZ5n\n+/em9nRjAgMBAAECggEATxLMO30+MFFRZoAD4qcz60g3d8nJDD9lQiVVuJKRCvSE\n6xLNweBYkaPbwLIRzwBUOkLbFyJtDvdCFYlzNioicI1gEfK0tUOhrgRDTa2rCthz\nsZc0jdl1FyJMZ4w8HcTT8GEpPWYP2YsVqRq2Byx4gzepKDZp7vdV3P+USiTxkcjS\nj2WH2YUf0h32hdImN2L9T0XchiUlsnEM8zGmpQMT0OPZd5vB7RUF+iov3qzr9Dwu\n6KQrBBF4MdH2CKEl1ZWCTwCyk0oZw30TFmpf9e/5/RQzL4N65VAMJfMZUJsZ75nL\nl99eahkPhxIj1w43SYA3+41FlBG9qEGJsB2+PNhQGQKBgQDoD7yb+blwER7QQ1Wc\noGVoF40kpFMk+6j+ezX1S0GZARlgrOdJlW5igMftpphphltLWhshQ630H1ZLPdfg\nr4NqDrv5HwQn+TisbCLVq9WybLpjPiwgDXmYUaNBoGLEJlXOpwUG/etjRbqGwZbw\nGB7C9y8eK8uZoitWJ6J6kYKkqQKBgQDc/JRik/U+s7c2zXs2D1vbXQ4fEi7xPvid\nOAjJoiGn/pkGzIgX6EQscXUKpnOvxGl/ymNNVwBy7xmZOBfas89dixW7emXT8T5y\nmX00Z84OJt1o7QqdKO/Pq2WhmXsCPNdn5K6nt+VtsTWS95rmUoMs/12w90hA6jT1\nC7bgfxHsKwKBgQDKDynDBiYZFk8mN/sLbf3eLOOQzCQ5R4dWTiIle2mauAJI00Rw\nJdT/n/J1U2HSQFKtwb9tr2h/7+lLioW19h0O89VojUEpLS/TsjSCqCRiP5nrX+87\n2X/OyQbF1ckp0ddVIMiX1fBneAd53oZ2eAoQ6Pn141xcYYAqfEhVQO3oQQKBgHeb\nIXjlWfRw8rXvq0NMNsxY5j686bla+talMGRpo0u4yfxbEUHXTaa8VbvI8Y5tgShQ\nU0TV1QFgFfvO12JgtdiMYdvR2HFI/iKqnpCRqn4QXP/gZEFBmeJNgzlex6wjX/b0\nV++g4cVoB3YfG7CTcjoVkREqFepEmRsUFwwU2o93AoGAH89f3odX7H38PZOM4GL8\npG+1rrAtSW5QNytljo8E+NLKHqJ8kso9SsCfBLSSlJlMZ3TcC3Qjim+z8ktHK1JU\nXj7RT2Ups1veOcgeRah0Bai94wg47qCBRx9TYs3Q534vhQ5p5X6z2fUOFLuRlxlW\njcMQRb6CSd1DdqYGkYN5zYA=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-s2q56@fitazfk-app.iam.gserviceaccount.com",
    "client_id": "108809447317928213697",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-s2q56%40fitazfk-app.iam.gserviceaccount.com"
  };

// firebase.initializeApp(firebaseConfig);

// exports.db = firebase.firestore();

// exports.auth = firebase.auth();
var admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    // databaseURL: "https://quickstart-1588594831516.firebaseio.com",
    // storageBucket: "quickstart-1588594831516.appspot.com",
    storageBucket: "fitazfk-app.appspot.com",
    databaseURL: "https://fitazfk-app.firebaseio.com"
  })
  
  module.exports = admin