import { Component, ElementRef, AfterViewInit, OnDestroy, signal, inject } from '@angular/core';
import { ImageComponent } from '../image/image';
import { Footer } from '../footer/footer';
import { MatProgressSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [ImageComponent, Footer, MatProgressSpinner],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private observer?: IntersectionObserver;

  images = signal<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver(): void {
    const footerElement = this.elementRef.nativeElement.querySelector('app-footer');

    if (!footerElement) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          this.loadMoreImages(3);
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    this.observer.observe(footerElement);
  }

  private loadMoreImages(count: number): void {
    const spinner = this.elementRef.nativeElement.querySelector('mat-spinner');
    spinner.style.display = "block";

    setTimeout(() => {
      this.images.update((prev) => {
        const nextId = prev.length + 1;
        const newItems = Array.from({ length: count }, (_, i) => nextId + i);
        return [...prev, ...newItems];
      });

      spinner.style.display = "none";
    }, Math.random() * 100 + 2000);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}