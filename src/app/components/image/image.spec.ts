import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageComponent } from './image';

describe('ImageComponent', () => {
  let fixture: ComponentFixture<ImageComponent>;
  let component: ImageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageComponent);
    fixture.componentRef.setInput('url', 'https://picsum.photos/seed/test/200/300');
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows a loading spinner until the image finishes loading', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeTruthy();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    img.dispatchEvent(new Event('load'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeFalsy();
  });

  it('shows an error message when the image fails to load', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.error')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('img')).toBeFalsy();
  });

  it('emits photoClick when the host is clicked', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const spy = vi.fn();
    component.photoClick.subscribe(spy);

    fixture.nativeElement.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
