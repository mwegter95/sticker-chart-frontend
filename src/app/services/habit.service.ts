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
      JSON.stringify({ name }), // wrap in object if your endpoint expects a DTO
      { headers: this.jsonHeaders }
    );
  }

  toggleEntry(habitId: number, date: string): Observable<HabitEntry> {
    // send the raw ISO string as JSON, with the correct header
    return this.http.post<HabitEntry>(
      `${this.api}/${habitId}/stickers`,
      JSON.stringify(date),
      { headers: this.jsonHeaders }
    );
  }
}
