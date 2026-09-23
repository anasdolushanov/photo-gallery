import { Component, input, output, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [MatProgressSpinner],
  templateUrl: './image.html',
  styleUrl: './image.scss',
  host: {
    '(click)': 'photoClick.emit()',
  },
})
export class ImageComponent {
  url = input.required<string>();

  photoClick = output<void>();

  isLoading = signal(true);
  hasError = signal(false);

  onLoad(): void {
    this.isLoading.set(false);
  }

  onError(): void {
    this.isLoading.set(false);
    this.hasError.set(true);
  }
}
