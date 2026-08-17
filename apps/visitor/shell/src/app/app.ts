import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { PhotoPickerComponent } from '@zoopervisor/ui';

@Component({
  imports: [NxWelcome, RouterModule, PhotoPickerComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'visitor';
}
