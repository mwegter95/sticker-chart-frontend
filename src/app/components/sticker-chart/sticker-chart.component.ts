// src/app/components/sticker-chart/sticker-chart.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitService, Habit } from '../../services/habit.service';

@Component({
  selector: 'app-sticker-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sticker-chart.component.html',
  styleUrls: ['./sticker-chart.component.scss'],
})
export class StickerChartComponent implements OnInit {
  // weekly view
  habits: Habit[] = [];
  weekDates: Date[] = [];
  newHabitName = '';

  // monthly view
  selectedHabit: Habit | null = null;
  viewMonth: Date = new Date();
  monthDates: Date[] = [];
  monthRows: Date[][] = [];
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  constructor(private habitSvc: HabitService) {}

  ngOnInit() {
    this.loadAll();
    this.generateWeek();
  }

  private loadAll() {
    this.habitSvc.getMyHabits().subscribe({ next: (h) => (this.habits = h) });
  }

  private generateWeek() {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // Monday=0
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);
    this.weekDates = Array.from(
      { length: 7 },
      (_, i) =>
        new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)
    );
  }

  createHabit() {
    if (!this.newHabitName.trim()) return;
    this.habitSvc.createHabit(this.newHabitName).subscribe({
      next: () => {
        this.newHabitName = '';
        this.loadAll();
      },
    });
  }

  countForDate(h: Habit, d: Date): number {
    return h.entries.filter(
      (e) => new Date(e.date).toDateString() === d.toDateString()
    ).length;
  }

  isFilled(h: Habit, d: Date, starIdx: number): boolean {
    return this.countForDate(h, d) >= starIdx;
  }

  onStarClick(h: Habit, d: Date, starIdx: number) {
    const dateStr = d.toISOString();
    const filled = this.isFilled(h, d, starIdx);
    this.habitSvc
      .toggleSticker(h.id, dateStr, filled)
      .subscribe({ next: () => this.loadAll() });
  }

  // switch to monthly view
  selectHabit(h: Habit) {
    this.selectedHabit = h;
    this.viewMonth = new Date();
    this.generateMonth();
  }

  private generateMonth() {
    const year = this.viewMonth.getFullYear();
    const month = this.viewMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const offset = (firstOfMonth.getDay() + 6) % 7; // Monday start
    const start = new Date(year, month, 1 - offset);
    this.monthDates = Array.from(
      { length: 42 },
      (_, i) =>
        new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    );
    this.monthRows = [];
    for (let r = 0; r < 6; r++) {
      this.monthRows.push(this.monthDates.slice(r * 7, r * 7 + 7));
    }
  }

  prevMonth() {
    this.viewMonth = new Date(
      this.viewMonth.getFullYear(),
      this.viewMonth.getMonth() - 1,
      1
    );
    this.generateMonth();
  }

  nextMonth() {
    this.viewMonth = new Date(
      this.viewMonth.getFullYear(),
      this.viewMonth.getMonth() + 1,
      1
    );
    this.generateMonth();
  }

  backToWeek() {
    this.selectedHabit = null;
    this.generateWeek();
  }
}
