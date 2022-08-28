// Production Variables

const firebaseConfiguration = {
  credentials: {
    "type": "service_account",
    "project_id": "fitazfk-app",
    "private_key_id": "caeeb652cd978f8d85b84cf4471210c7b20f744e",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCwqVxVHn5kOkqH\nGNZ9gk3AbWXuyaipl66/SCHlaZ56eDacMmjPvOSEt+UgVuBvqsoem7TsC9pz6G3J\njsUfdfi6HZN5EE79hNc4q4dC6SJEucxFXtIsBare9bSRAfx/DXSSd8oOSZHn4Jl6\nm2B/Nw4tmwtxOmPk8TdnCI60ylLB4WhDJBjiepn1+U4pNh92okpFPoMUMgGuXh/9\nSDBcy0lkOJAry8CYeWra3AV0+Y+hvnCCTe39IQ7I6JVsC8SaaS1jqj/HL46jdrQn\nlIJFfooTZ43Yzck3Z0GApCrd79M2W/O8e2Qpbua23IZ4eL4nU40cdTOk0deCgDly\nPUv/NkZRAgMBAAECggEAAZmWZlzItoHqzvXVayIpBTErHd+PQrJG26uMsgoT4eZQ\n5qHUE5iRexcQG6E/IQfGEu2kVMnH3FT1L0DW+HGuM1+lSFCytHFVl9PsMqRk95l1\nWAX+MjZJbZbtABi0DOxbZfWw25JZ6ySRuJvBDZnl1m7RFVZllUsuziTfJ6mYQwen\n8CXsbO78zi3GZoZvy5ie7GLh6gR31m1P95lRaVPoahQo2oCT35GxeakxcMwY+N9e\nczk4pWGqfblFtLRoegrR5QQcWEceu+zJ/olr8QyRB+Qca7hKocJU7hRtzj4H8mgk\nBcWGHTjkQViYERStZ5qE+3lthvoaGTFRN+t28J21uQKBgQDVwM/cL+E76B9YW7UC\nqCc/WuqUM2szckysBxOxLrf1YiUQDN9CsPMqwWBGdfAbKQMzh6x2N8xmzukVTZ+P\n5IicxfW2aSg5bpACEptLm5dNz9PUIDWmOXzOKKgGwCdPBQoWikjE4cTgzrc0oFvk\na0Dp43W0r889ouUCG0zSnSvESQKBgQDTk9a69AQROjALRlK7/9kKqSPf00uIGi6B\nEKlXWMf6bWeCWe9d8TM9fBc5p2kpSv3FszqjjuxMXvRe5mSm0Cq9y2dbNhybCpZB\nXqNI08XPd29KA1W5n2u+aWNTysE6cpbi0q29BiN7djzBfvErM+tsW/RxZNfec0tR\njBdVo63hyQKBgQCp8MlRPZ/MiReioAahPh8194pYmSi5lj3u5xF45LPMm2LsB8/Y\nreYmL+fjHRDwBwNMjKlIs8QGWKpnDXe2ZvNV8O0RQTmBr60+eJyO1/zLGFhJZfJB\nXaMkJJ6x/0NBR7hlgzuni/eC49Y0OOnWCI9rZDPIm54gWsnHivzg1aReQQKBgGv/\nofNqTY0xo4aNzfuS/IoZjmtZIswFeUl+ZMJmWiX1pImAONQ+I8a1yfEvCFoAootB\nEqScdvgA3EJ43lXcGoUpB8giVfW6MLqLgVPSbb2aHJ+uFhsbSlc22nHSJFIeXfDI\nU9ESChiiYR7wGlDQPtLgGWWscRhmx8KHfP3FACQpAoGBAJ9VIY5lNYRVNv7/tz25\nlVNQxfpa1zRWT59FWDNOjI2rJzASvBt1gw+kQbUbpDq+BOreOFp0p0Vvqoc+gcOW\nZJMYWBAefM4SNoEbSch8xYyWFXJUg7ue/DbSNqe7Inu/HDGvVl4N3GlEIgBMAbZ5\nUt17QtxQHZSpdbAFVMpcnJ2J\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-hep4p@fitazfk-app.iam.gserviceaccount.com",
    "client_id": "102065208971400800529",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hep4p%40fitazfk-app.iam.gserviceaccount.com"
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