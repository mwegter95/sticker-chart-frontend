import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

export interface HabitEntry { id: number; date: string; completed: boolean }
export interface Habit { id: number; userId: string; name: string; entries: HabitEntry[] }

@Injectable({ providedIn: 'root' })
export class HabitService {
  private api = `${environment.apiUrl}/habits`

  constructor(private http: HttpClient) {}

  getMyHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(`${this.api}/mycharts`)
  }

  createHabit(name: string) {
    return this.http.post<Habit>(`${this.api}/create`, { name })
  }

  toggleEntry(habitId: number, date: string) {
    return this.http.post<HabitEntry>(`${this.api}/${habitId}/stickers`, date)
  }
}
