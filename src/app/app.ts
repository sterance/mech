import { Component, computed, signal } from '@angular/core';
import { UnitCardComponent } from './unit-card/unit-card.component';
import { FilterComponent } from './filter/filter.component';
import { Unit } from './models/unit.model';
import { logInfo } from './utils/log.utils';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import unitsData from '../data/units.json';
import technologiesData from '../data/technologies.json';

@Component({
  selector: 'app-root',
  imports: [ UnitCardComponent, FilterComponent, ...HlmCheckboxImports],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mech');
  protected readonly selectedTechnologies = signal<Set<string>>(new Set());
  protected readonly searchText = signal<string>('');
  protected readonly minCost = signal<number>(50);
  protected readonly maxCost = signal<number>(500);
  
  private readonly unitOrder = [
    'Crawler',
    'Fang',
    'Hound',
    'Void Eye',
    'Arclight',
    'Marksman',
    'Mustang',
    'Sledgehammer',
    'Stormcaller',
    'Steel Ball',
    'Fire Badger',
    'Sabertooth',
    'Tarantula',
    'Rhino',
    'Hacker',
    'Wasp',
    'Phoenix',
    'Phantom Ray',
    'Wraith',
    'Scorpion',
    'Farseer',
    'Vulcan',
    'Melting Point',
    'Fortress',
    'Sandworm',
    'Raiden',
    'Overlord',
    'War Factory',
    'Abyss',
    'Mountain',
    'Typhoon'
  ];
  
  private readonly allUnits: Unit[] = this.sortUnits(unitsData.map(unit => Unit.fromJson(unit)));

  protected readonly filteredUnits = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    const min = this.minCost();
    const max = this.maxCost();
    
    return this.allUnits.filter(unit => {
      const matchesSearch = search === '' || unit.technologies.some(tech => 
        tech.name.toLowerCase().includes(search)
      );
      
      const matchesCostRange = unit.technologies.some(tech => 
        tech.cost >= min && tech.cost <= max
      );
      
      return matchesSearch && matchesCostRange;
    });
  });

  constructor() {
    this.checkMissingTechnologies();
  }

  private sortUnits(units: Unit[]): Unit[] {
    const orderMap = new Map(this.unitOrder.map((name, index) => [name, index]));
    return units.sort((a, b) => {
      const orderA = orderMap.get(a.name) ?? Infinity;
      const orderB = orderMap.get(b.name) ?? Infinity;
      return orderA - orderB;
    });
  }

  toggleTechnology(techName: string): void {
    const current = this.selectedTechnologies();
    const updated = new Set(current);
    if (updated.has(techName)) {
      updated.delete(techName);
    } else {
      updated.add(techName);
    }
    this.selectedTechnologies.set(updated);
  }

  private checkMissingTechnologies(): void {
    const technologiesSet = new Set(technologiesData);
    const allUnitTechNames = new Set<string>();
    
    unitsData.forEach(unit => {
      unit.technologies.forEach(tech => {
        allUnitTechNames.add(tech.name);
      });
    });

    const missing = Array.from(allUnitTechNames).filter(
      techName => !technologiesSet.has(techName)
    );

    if (missing.length > 0) {
      logInfo(`Found ${missing.length} technology name(s) in units.json not present in technologies.json:`, {
        level: 'warn',
        data: missing,
        group: true
      });
    } else {
      logInfo('All technology names in units.json are present in technologies.json', {
        level: 'info'
      });
    }
  }
}