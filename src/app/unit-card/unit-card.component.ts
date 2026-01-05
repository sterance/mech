import { Component, computed, Input, output } from '@angular/core';
import { getImageURL } from '../utils/image.utils';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { Unit } from '../models/unit.model';
import { Technology } from '../models/technology.model';

@Component({
  selector: 'app-unit-card',
  standalone: true,
  imports: [...HlmCardImports],
  templateUrl: './unit-card.component.html',
  styleUrl: './unit-card.component.css'
})
export class UnitCardComponent {
  @Input() unit!: Unit;
  @Input() selectedTechnologies: Set<string> = new Set();
  @Input() searchText: string = '';
  @Input() minCost: number = 50;
  @Input() maxCost: number = 500;
  technologyToggled = output<string>();
  
  getImageURL = getImageURL;

  get filteredTechnologies(): Technology[] {
    const search = this.searchText.toLowerCase().trim();
    return this.unit.technologies.filter(tech => {
      const matchesSearch = search === '' || tech.name.toLowerCase().includes(search);
      const matchesCost = tech.cost >= this.minCost && tech.cost <= this.maxCost;
      return matchesSearch && matchesCost;
    });
  }
  
  onTechnologyClick(techName: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.technologyToggled.emit(techName);
  }
  
  isSelected(techName: string): boolean {
    return this.selectedTechnologies?.has(techName) ?? false;
  }
}