// src/app/services/habit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HabitEntry {
  id: number;
  date: string;
  completed: boolean;
}
export interface Habit {
  id: number;
  userId: string;
  name: string;
  entries: HabitEntry[];
}

@Injectable({ providedIn: 'root' })
export class HabitService {
  private api = `${environment.apiUrl}/habits`;
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getMyHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(`${this.api}/mycharts`);
  }

  createHabit(name: string): Observable<Habit> {
    return this.http.post<Habit>(
      `${this.api}/create`,
      JSON.stringify({ name }),
      { headers: this.jsonHeaders }
    );
  }

  addSticker(habitId: number, date: string): Observable<HabitEntry> {
    return this.http.post<HabitEntry>(
      `${this.api}/${habitId}/stickers`,
      JSON.stringify(date),
      { headers: this.jsonHeaders }
    );
  }

  removeSticker(habitId: number, date: string): Observable<void> {
    return this.http.request<void>(
      'delete',
      `${this.api}/${habitId}/stickers`,
      { body: JSON.stringify(date), headers: this.jsonHeaders }
    );
  }

  // now returns Observable<any> unambiguously
  toggleSticker(
    habitId: number,
    date: string,
    remove: boolean
  ): Observable<any> {
    return remove
      ? this.removeSticker(habitId, date)
      : this.addSticker(habitId, date);
  }
}
