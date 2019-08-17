/**
 * A simple client-side only model used to list users in the Admin view, which
 * is acessible if logged in on a profile that has { "admin": true } set on it.
 * It is not used for anything else.
 */
import fetch from 'isomorphic-fetch'

export default class {
  
  static async list({
    page = 0,
    size = 10
  } = {}) {
    return fetch(`/admin/users?page=${page}&size=${size}`, {
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.ok) {
        return Promise.resolve(response.json())
      } else {
        return Promise.reject(Error('HTTP error when trying to list users'))
      }
    })
    .then(data => {
      return data
    })
    .catch(() => Promise.reject(Error('Error trying to list users')))
  }

}
