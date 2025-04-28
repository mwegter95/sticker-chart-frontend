import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // for *ngFor, *ngIf, date pipe, etc
import { HabitService, Habit } from '../../services/habit.service';

@Component({
  selector: 'app-sticker-chart',
  standalone: true,
  imports: [CommonModule], // <-- include CommonModule
  templateUrl: './sticker-chart.component.html',
})
export class StickerChartComponent implements OnInit {
  habits: Habit[] = [];
  dates: Date[] = [];

  constructor(private habitSvc: HabitService) {}

  ngOnInit() {
    this.fetchHabits();
  }

  fetchHabits() {
    this.habitSvc.getMyHabits().subscribe((h) => {
      this.habits = h;
      this.initDates();
    });
  }

  initDates() {
    const today = new Date();
    this.dates = Array.from(
      { length: 7 },
      (_, i) =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
    );
  }

  isCompleted(h: Habit, date: Date) {
    return h.entries.some(
      (e) =>
        new Date(e.date).toDateString() === date.toDateString() && e.completed
    );
  }

  toggle(h: Habit, date: Date) {
    this.habitSvc
      .toggleEntry(h.id, date.toISOString())
      .subscribe(() => this.fetchHabits());
  }
}
