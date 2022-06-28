// Production Variables

const firebaseConfiguration = {
  credentials: {
  "type": "service_account",
  "project_id": "quickstart-1588594831516",
  "private_key_id": "f8b8759ce84c3170758f504b82c685444212eacb",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCziCYx8jJbvPYk\nhwW2QOA3iYDRH4KGGgdpQV43gQuzDBzNAg0o9dYSah0E/b+qNjlpXZKpKl+ohb+b\nCVjTwUhFEbGLXPCObuqftl947VR024M8rqpKRZ8c20SSgfARy9ZVwVRuwnpTMw9X\nwd9+6EbqiEod8lr4TpZ3eJHFLO9Eex7Vp6tR/0pK57isLxyAnuuqeAZPGARp4iOD\nHDeM9UViAGcOBmQk7czQTr7fw2Clj10WnOkhgEwLC28928QVVkRCZSkJKsiNU/l8\n30Cr/rNqpe2ZgxXwedalSs75Z3vEImJKB6HecDMFcVP9ObZkOaClzPmrXu5paGWj\nSrC5IJ6LAgMBAAECggEAC3TGqy0/VWdLda1ACg89v42AsNeH5rLGgkrvji8n5fcB\n53sYB+MYE/i9fVIL5vqq0zRrZWwUypYuUeBY0LpmuDGW2MPHfe9J/YMPuJG8b/CK\nAVdL+o1Sx+6eA5NTFG+jb7l0f9TdJW3+rqTqdBiyXcjwodSTRYEOTPVep+xkIER3\nWtBcl7b7eoJtuiY/0AbjX01AncvhJlA0xbLHJMsrt7BWXIPIBnyco3q3lF/4Cy1N\nTeVYxA48oDNfcX5HcOKiNK6E84BT6KBh62hKph0XaTvPL3HQk7pfrTabmhmwj92U\nWNdryb2N8kdlaSWY1Cly9+ewn63L387UfCjZq8f6EQKBgQD44oJqXRNA83Hzk3Ve\n1NoDwIjAZ8VhJdD3dEOLZz/6IV4tX9eVbGGDNU0FaWrbfVgBH9A2/zXMnMP7N1Fy\nBcrpvsWDrsRC8Hf7Y1Uf3E6nTug1SDHX79faMGRnMqVi2tocOLaC0HqWcxHELdMl\nxcT0eLZtPjdBYYamzgTR0rnK/wKBgQC4qhKO8IpjHREeT/FTgfpSanKFv2Fk0KfQ\n+fA/8iVodeMcH2vd4r9Fj0r+sMWznDJuvq/iaGG3uLdgI5K2A6oEPki+U9VbUO9s\n6UoYGA80Ps27i+ZcJepg38N2jAkQ268Z957yqfmMa9knON+G1uD0FO3enX0otXGV\nBim46IEodQKBgQC1HcDiPlFglsh6BPkIxcTRri7WNa4BgE+NhGIS9FQuZlHumyx7\nZJ+hqAwgwBIvIAwG5WvUWeyAtiQ4kI0IeQatC1MY/Pl97RijLCoqQVxLjLSW8a60\nAaoG8ehe4RBR3AmVOAA5OhW7nolzRhW+CynE7oNzBC+ZuKsQgCQpvTvPaQKBgGxI\n3oUPLDceblFWE28igsUdQnaHWPcjG6UBSw5UUfdFWZ2+FySPuBV0B0f+JJBEAZbL\nHpwnFVYEbRNlCLzOvT2rwEBLLItVlHBLBHXIdfHu+fkF+lkCqsOPszCqwQ4vpCgX\n+g7V+U2MWFQVl42cJ2E5fJrTwvbCHw6CBKk3PbWZAoGAQYTrNdeF+pnczP/iOOOh\nxD43O7iD6lO1unpVhRWPsSH1S57/rZZD6QOBtWtio39gA1mxiexuwwek7HITDf6z\naF7xJIZmrG7FoGMUhgkAzJnO5xJpi3twfRpoK/XO7pSL/ofo0y25Pa2+elvu60dZ\nJFE5Xoag9lD4mmSvRAid9mA=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-p4vxt@quickstart-1588594831516.iam.gserviceaccount.com",
  "client_id": "104182960927988919857",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-p4vxt%40quickstart-1588594831516.iam.gserviceaccount.com"
},
  options: {
    databaseURL : "https://fitazfk-app.firebaseio.com",
    storageBucket: "fitazfk-app.appspot.com"
  }
}

// Staging Varaibles
// const firebaseConfiguration = {
//   credentials: {
//     "type": "service_account",
//     "project_id": "staging-fitazfk-app",
//     "private_key_id": "56e2798a38289888b5eefea866ba3748684652b6",
//     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuZNcRy1338weK\n47UHdrJ8E+x0zw0kW7l4Dtl7k0bJ7jo5bg/XYBHuoI+CfLh3E4POQrpQ/+K3Lu61\nud9D3FxIKJkOyABAWLIN+781BbtcT8sQqb0AdTaRzne5oqDqgXv9kNx0NuxxT0EU\n/qaFL5yPIox32cEnesPBNnyyIQMzPJDaIGXIV4daDyJRid3KasuBfG1Tc179COgD\no+cW+ixMi8E5JpM+5zFoa2mNWvbyWyGojjqpjWJCe5k4nNNuiIgIqrAgfgz8asmp\nGRpWSV9Dq3yM+qxoTOdmNXmh/e4gzOYC6it2kqXAhAQsSHyjsA5ZScsci7mJA0Vw\njNWzUCyZAgMBAAECggEAErr26czaCLBGrkalof8VeBkbC4f/b9kVfaJj/mSY35r2\nuvCqF+Y+wXk84KAXnzEZNh/ZlgCIWkdapmmnuUijdVvoOyZaTI7vf2v7Tde8l1Nk\nn84IjtIyrGICCY3rfYmvBlK23W6BYkFyX9hijH8gGrQfD8ed+hOyjv+/UHxrimbj\nPu4Od3uEcZlXn3LjSprTHnj2QTeelwQFSiGdrXx9Ds7ry8fH0rXq236cZoNPXbAK\nop+h00lncM9eZEAzvU5wj60YgcVWb/kgnzSCvDGv+oh/GhXsar/DOsHdm9Z689FA\nhBhrJaD4Mv27QiAD21btb11ieHf2E/XTvETPiLqsLwKBgQDgaUhvwunWNsxetMNr\nMUDIRC5nHxMq5sYZ/XrFCw/6R5KdZSqdTXz4v8AC8QuHDg/tUF74u4Hg6UiOjpLA\n9ADmGas/uz/zduMzgkW9/4FPA0kWYIU+M1I/uuYmaL1QjAI4teUevryxxP72LQOR\nOiXWRjsBzXQ+y44qCsiBU9jMNwKBgQDG8StE/Y4WfuoAfyt99UECIaq9jLdaKTxf\n2tXxv/5AbFMN2O8LtFwVSuXHJ8lPZtDTtdhOO1isZXHYQGNcLOX32L1r4/dY2RrR\n0O2DPbOM/1s3nhUqfIYaY/ehbeBGHQydesNVP+cNlQU7APZsIToIOb/gUW8ZLNx2\nZaHC5hyFrwKBgBTac7q++A/J48/hKE+rsgNqIo2+m39fFoWPwnrQ/lkZkYxCvGUF\nsFlFKEidsZ6JNf2tfEXM1tLZmr50jTqU8ghv1jQD6HttTsuYjXaMaa239nC342nW\nRwxZB84F6aG0gPhYHsRuoQY78h1aLXyvVJjGyfDu8KBtNfa+LcemzPydAoGAHang\nNc1I3nnWEnTj20gyhUrX1qOgw0Tax8AtnnpuQtTkHXB3VFt0T4h3cpawIbLG+Ipo\n0mFu+2W07/XJ2vim4anjtK6tNwZIRXjNsYAFwcRhqY1cwpUGufCl/+AOTOYP93tS\nnOeGYDQUL5QZKk5aBNf3kE8ULcDOrqjA0frVzekCgYEAl/+32lAUsfYX/mKT2SZK\nq9V0PTJa4OaQ4+0UuHB8a2D2gqNG4AH/9CWufWLiWOPv3fkTic8A0rWIRNBltext\nQPZJzIpZ8Z5LyJqeHk0SyXeGxQCL+GBJdzn5P8NDNBvnYC94R9Q5ZNSdQ+csDXxf\n4V3xtz8Nglx9gSOEq4ENV6o=\n-----END PRIVATE KEY-----\n",
//     "client_email": "firebase-adminsdk-d7bik@staging-fitazfk-app.iam.gserviceaccount.com",
//     "client_id": "104398154545108514101",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-d7bik%40staging-fitazfk-app.iam.gserviceaccount.com"
//   },
//   options: {
//     databaseURL : "https://staging-fitazfk-app.firebaseio.com",
//     storageBucket: "staging-fitazfk-app.appspot.com"
//   }
// }

var admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(firebaseConfiguration.credentials),
    ...firebaseConfiguration.options
  })
  
  module.exports = admin