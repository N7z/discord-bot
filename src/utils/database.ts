import type { User } from '../types/database.ts';
import {
  getAllUserRows,
  addBank as _addBank,
  removeBank as _removeBank,
  addBalance as _addBalance,
  removeBalance as _removeBalance,
  updateLastDaily as _updateLastDaily,
  updateLastWork as _updateLastWork,
  hasStartingClaimed as _hasStartingClaimed,
  setStartingClaimed as _setStartingClaimed,
} from '../repositories/usersRepo.ts';
import {
  updateBio as _updateBio,
  updateBgColor as _updateBgColor,
  updateBgImage as _updateBgImage,
} from '../repositories/profilesRepo.ts';
import { getOrCreateUserWithProfile } from '../services/userService.ts';
export { initDatabase } from '../database/connection.ts';

export async function getUser(userId: string): Promise<User> {
  return getOrCreateUserWithProfile(userId);
}

export async function getAllUsers() {
  return getAllUserRows();
}

export async function addBank(userId: string, amount: number): Promise<void> {
  return _addBank(userId, amount);
}

export async function removeBank(userId: string, amount: number): Promise<void> {
  return _removeBank(userId, amount);
}

export async function addBalance(userId: string, amount: number): Promise<void> {
  return _addBalance(userId, amount);
}

export async function removeBalance(userId: string, amount: number): Promise<void> {
  return _removeBalance(userId, amount);
}

export async function updateLastDaily(userId: string, dateString: string): Promise<void> {
  return _updateLastDaily(userId, dateString);
}

export async function updateLastWork(userId: string, date: number): Promise<void> {
  return _updateLastWork(userId, date);
}

export async function updateBio(userId: string, newBio: string): Promise<void> {
  return _updateBio(userId, newBio);
}

export async function updateBgColor(userId: string, newColor: string): Promise<void> {
  return _updateBgColor(userId, newColor);
}

export async function updateBgImage(userId: string, imageUrl: string): Promise<void> {
  return _updateBgImage(userId, imageUrl);
}

export async function hasStartingClaimed(userId: string): Promise<boolean> {
  return _hasStartingClaimed(userId);
}

export async function setStartingClaimed(userId: string): Promise<void> {
  return _setStartingClaimed(userId);
}
