import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideZooI18n } from '@zoo/shared/i18n';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // The shell injects TranslocoService for the assist strip's language switch.
      providers: [provideRouter([]), provideZooI18n()],
    }).compileComponents();
  });

  it('renders the shell chrome', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-brand')?.textContent).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
