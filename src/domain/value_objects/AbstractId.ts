export abstract class AbstractId {
  public constructor(private readonly id: number) {
    this.checkIsValidId(id);
  }

  protected abstract checkIsValidId(id: unknown): void;

  protected isValidNumericId(id: unknown): boolean {
    return (
      typeof id === 'number' &&
      Number.isInteger(id) &&
      id > 0 &&
      Number.isFinite(id)
    );
  }

  public asNumber(): number {
    return this.id;
  }

  public toString(): string {
    return String(this.asNumber());
  }
}
