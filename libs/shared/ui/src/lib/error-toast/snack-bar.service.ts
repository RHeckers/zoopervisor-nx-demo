import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  action: string;
}

/** A tiny MatSnackBar stand-in so the demo needs no @angular/material. */
@Injectable({ providedIn: 'root' })
export class SnackBar {
  readonly current = signal<Toast | null>(null);

  open(message: string, action: string): void {
    this.current.set({ message, action });
  }

  dismiss(): void {
    this.current.set(null);
  }
}
