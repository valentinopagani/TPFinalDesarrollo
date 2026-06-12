import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.html',
  styleUrl: './bottom-sheet.css',
})
export class BottomSheet {
  @Input({ required: true }) title = '';
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  onBackdropClick(): void {
    this.close.emit();
  }
}
