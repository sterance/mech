import { Component, Input } from '@angular/core';
import { getImageURL } from '../utils/image.utils';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { Unit } from '../models/unit.model';

@Component({
  selector: 'app-unit-card',
  standalone: true,
  imports: [...HlmCardImports],
  templateUrl: './unit-card.component.html',
  styleUrl: './unit-card.component.css'
})
export class UnitCardComponent {
  @Input() unit!: Unit;
  getImageURL = getImageURL;
}