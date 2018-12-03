import request from '../utils/request';

export function query(data) {
  return request('http://10.173.0.139:8001/api/account/login', {
    methods: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: data,
})
}
