import { Component, model, output, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

export interface FilterValues {
  searchText: string;
  minCost: number;
  maxCost: number;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgIf, ...HlmInputImports, ...HlmSliderImports],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  searchText = model<string>('');
  minCost = model<number>(50);
  maxCost = model<number>(500);
  
  protected readonly sidebarOpen = signal<boolean>(false);

  protected setMinCost(value: number): void {
    const max = this.maxCost();
    this.minCost.set(Math.min(value, max));
  }

  protected setMaxCost(value: number): void {
    const min = this.minCost();
    this.maxCost.set(Math.max(value, min));
  }
}

