export class Technology {
  private static nextId = 1;
  
  constructor(
    public name: string,
    public cost: number,
    public id: number = Technology.nextId++
  ) {}

  static fromJson(json: { name: string; cost: number }): Technology {
    return new Technology(json.name, json.cost);
  }
}