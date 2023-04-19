import { User } from "../types/user";

export function saveUser(user: User) {
  // Update token in storage
  window.localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  const user = window.localStorage.getItem('user');
  if (user) {
    return JSON.parse(user);
  }

  return null;
}

export function deleteUser() {
  window.localStorage.removeItem('user');
}
