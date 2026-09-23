import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([
          { path: '', component: Header },
          { path: 'favorites', component: Header },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('highlights Photos as active on the root route', async () => {
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].classList.contains('active')).toBe(true);
    expect(buttons[1].classList.contains('active')).toBe(false);
  });

  it('highlights Favorites as active on /favorites, and not Photos', async () => {
    await router.navigateByUrl('/favorites');
    fixture.detectChanges();
    await fixture.whenStable();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].classList.contains('active')).toBe(false);
    expect(buttons[1].classList.contains('active')).toBe(true);
  });
});
