const isDev = process.env.NODE_ENV === 'development'

export default {
  title: 'Shareading - ',
  host: isDev ? 'http://127.0.0.1:3000' : 'http://top-backend.geeklabs.vc',
  token: '44ebe611c992d18d5fbf60694386df13',
  userid: '58bcdff1dc68572540cdd2f2',
}
