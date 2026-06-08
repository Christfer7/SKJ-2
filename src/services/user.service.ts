import { Injectable, signal } from '@angular/core';
import { User, LoginData, UserDetail } from '../models/user.model';

interface AdditionalUserData {
  gender: string;
  probability: number;
  country: string;
  state: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users = signal<User[]>([]);
  loginData = signal<LoginData | null>(null);
  userDetails = signal<UserDetail[]>([]);
  selectedUser = signal<User | null>(null);
  showDetailButton = signal(false);
  isLoggedIn = signal(false);
  searchTerm = signal('');
  currentDetailStartTime = signal<string | null>(null);
  additionalUserData = signal<AdditionalUserData | null>(null);
  private loginTimestamp: number | null = null;
  private loggedInUserId: number | null = null;

  async loadUsers() {
    try {
      const response = await fetch('https://dummyjson.com/users');
      const data = await response.json();
      this.users.set(data.users);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  login(firstName: string, lastName: string) {
    const normalizedFirstName = firstName.trim().toLowerCase();
    const normalizedLastName = lastName.trim().toLowerCase();

    const user = this.users().find(u =>
      u.firstName.toLowerCase() === normalizedFirstName &&
      u.lastName.toLowerCase() === normalizedLastName
    );

    if (!user) {
      return false;
    }

    this.isLoggedIn.set(true);
    this.loginTimestamp = Date.now();
    this.loggedInUserId = user.id;

    this.loginData.set({
      firstName: user.firstName,
      lastName: user.lastName,
      loginTime: this.formatDateTime(new Date()),
      clickCount: 0
    });

    return true;
  }

  logout() {
    this.endCurrentDetailViewing();

    if (this.loginTimestamp !== null) {
      const durationMs = Date.now() - this.loginTimestamp;
      const totalSeconds = Math.ceil(durationMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const formattedDuration =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      alert(`Celkovy cas prihlasenia: ${formattedDuration}`);
    }

    this.isLoggedIn.set(false);
    this.loginData.set(null);
    this.selectedUser.set(null);
    this.showDetailButton.set(false);
    this.userDetails.set([]);
    this.searchTerm.set('');
    this.currentDetailStartTime.set(null);
    this.additionalUserData.set(null);
    this.loginTimestamp = null;
    this.loggedInUserId = null;
  }

  getLoggedInUserId(): number | null {
    return this.loggedInUserId;
  }

  incrementClickCount() {
    const current = this.loginData();
    if (current) {
      this.loginData.set({
        ...current,
        clickCount: current.clickCount + 1
      });
    }
  }

  selectUser(user: User) {
    this.endCurrentDetailViewing();
    this.selectedUser.set(user);
    this.showDetailButton.set(true);
    this.additionalUserData.set(null);
  }

  showUserDetail() {
    const selected = this.selectedUser();
    if (selected) {
      this.currentDetailStartTime.set(this.formatTime(new Date()));
      this.loadAdditionalUserData(selected);
    }
  }

  endDetailViewing() {
    this.endCurrentDetailViewing();
    this.currentDetailStartTime.set(null);
    this.additionalUserData.set(null);
  }

  endCurrentDetailViewing() {
    const selected = this.selectedUser();
    const startTime = this.currentDetailStartTime();

    if (selected && startTime) {
      const endTime = this.formatTime(new Date());
      this.userDetails.update(details => [
        ...details,
        {
          name: `${selected.firstName} ${selected.lastName}`,
          startTime,
          endTime
        }
      ]);
      this.currentDetailStartTime.set(null);
    }
  }

  async loadAdditionalUserData(user: User) {
    try {
      const postalCode = user.address?.postalCode?.toString().replace(/\D/g, '').slice(0, 5) ?? '';

      const [genderResponse, locationResponse] = await Promise.all([
        fetch(`https://api.genderize.io?name=${encodeURIComponent(user.firstName)}`),
        postalCode
          ? fetch(`https://api.zippopotam.us/us/${postalCode}`)
          : Promise.resolve(new Response(null, { status: 404 }))
      ]);

      const genderData = genderResponse.ok ? await genderResponse.json() : null;
      const locationData = locationResponse.ok ? await locationResponse.json() : null;

      this.additionalUserData.set({
        gender: genderData?.gender ?? 'unknown',
        probability: Number(genderData?.probability ?? 0),
        country: locationData?.country ?? 'unknown',
        state: locationData?.places?.[0]?.state ?? 'unknown'
      });
    } catch (error) {
      console.error('Error loading additional data:', error);
      this.additionalUserData.set({
        gender: 'unknown',
        probability: 0,
        country: 'unknown',
        state: 'unknown'
      });
    }
  }

  filteredUsers() {
    const term = this.searchTerm().trim().toLowerCase();
    const loggedInId = this.loggedInUserId;
    const visibleUsers = this.users().filter(user => user.id !== loggedInId);

    if (!term) {
      return visibleUsers;
    }

    return visibleUsers.filter(user => user.lastName.toLowerCase().includes(term));
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  private formatDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year} ${this.formatTime(date)}`;
  }
}
