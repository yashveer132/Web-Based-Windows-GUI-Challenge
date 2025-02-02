/**
 * Utility functions for managing user profiles, themes, and user-related data
 * using localStorage in a WebOS-like environment.
 *
 * Key Features:
 * - Manage stored user data: get, set, and remove users.
 * - Maintain multiple user profiles with functions to add, edit, and remove profiles.
 * - Handle user-specific themes by saving and retrieving theme preferences.
 */

export function getStoredUser() {
  const user = localStorage.getItem("webos_user");
  return user ? JSON.parse(user) : null;
}

export function setStoredUser(user) {
  if (!user) {
    localStorage.removeItem("webos_user");
  } else {
    localStorage.setItem("webos_user", JSON.stringify(user));
  }
}

export function getAllProfiles() {
  const data = localStorage.getItem("webos_profiles");
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

export function addProfile(profileName) {
  const profiles = getAllProfiles();
  if (!profiles.includes(profileName)) {
    profiles.push(profileName);
    localStorage.setItem("webos_profiles", JSON.stringify(profiles));
  }
}

export function removeProfile(profileName) {
  const profiles = getAllProfiles();
  const updatedProfiles = profiles.filter((profile) => profile !== profileName);
  localStorage.setItem("webos_profiles", JSON.stringify(updatedProfiles));
}

export function editProfileName(oldName, newName) {
  const profiles = getAllProfiles();
  const updatedProfiles = profiles.map((profile) =>
    profile === oldName ? newName : profile
  );
  localStorage.setItem("webos_profiles", JSON.stringify(updatedProfiles));
}

export function getThemeForUser(username) {
  return localStorage.getItem(`webos_theme_${username}`);
}

export function setThemeForUser(username, themeName) {
  localStorage.setItem(`webos_theme_${username}`, themeName);
}
