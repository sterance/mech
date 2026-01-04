import { Component, signal } from '@angular/core';
import { UnitCardComponent } from './unit-card/unit-card.component';
import { Unit } from './models/unit.model';
import { Technology } from './models/technology.model';
import unitsData from '../data/units.json';
import technologiesData from '../data/technologies.json';

@Component({
  selector: 'app-root',
  imports: [ UnitCardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mech');
  
  private technologiesMap = new Map<string, Technology>(
    technologiesData.map(tech => [tech.name, Technology.fromJson(tech)])
  );
  
  units: Unit[] = unitsData.map(unit => new Unit(
    unit.name,
    unit.technologies
      .map(techName => this.technologiesMap.get(techName))
      .filter((tech): tech is Technology => tech !== undefined)
  ));
}