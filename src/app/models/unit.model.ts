import { Technology } from './technology.model';

export class Unit {
  private static nextId = 1;
  
  constructor(
    public name: string,
    public technologies: Technology[],
    public id: number = Unit.nextId++
  ) {}

  static fromJson(json: { name: string; technologies: Array<{ name: string; cost: number }> }): Unit {
    return new Unit(
      json.name,
      json.technologies.map(tech => Technology.fromJson(tech))
    );
  }
}