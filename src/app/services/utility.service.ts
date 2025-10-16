import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  
  // ─────────────────────────────
  // 🔤 Napnevek fordítása
  // ─────────────────────────────
  mapDayToHungarian(day: string): string {
    const map: Record<string, string> = {
      Monday: 'Hétfő',
      Tuesday: 'Kedd',
      Wednesday: 'Szerda',
      Thursday: 'Csütörtök',
      Friday: 'Péntek',
      Saturday: 'Szombat',
      Sunday: 'Vasárnap'
    };
    return map[day] || day;
  }

  mapDayToEnglish(day: string): string {
    const map: Record<string, string> = {
      'Hétfő': 'Monday',
      'Kedd': 'Tuesday',
      'Szerda': 'Wednesday',
      'Csütörtök': 'Thursday',
      'Péntek': 'Friday',
      'Szombat': 'Saturday',
      'Vasárnap': 'Sunday'
    };
    return map[day] || day;
  }

  // ─────────────────────────────
  // ⏱️ Idő konvertálás / formázás
  // ─────────────────────────────

  /**
   * "09:00:00" → "09:00"
   */
  formatTime(time: string): string {
    if (!time) return '';
    return time.slice(0, 5);
  }

  /**
   * "08:00" → percek száma (480)
   */
  toMinutes(t: string): number {
    const m = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return NaN;
    const h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    return h * 60 + min;
  }

  /**
   * percekből "HH:mm" formátumot ad
   */
  toHHmm(t: string): string {
    const mins = this.toMinutes(t);
    if (Number.isNaN(mins)) return t;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
}
