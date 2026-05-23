export class DateFormatter {
  static parseDisplayDate(value: string): Date | null {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
    return match ? DateFormatter.createValidDate(match) : null;
  }

  static parseDatabaseDateTime(value: string): Date | null {
    const match = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/.exec(value.trim());
    return match ? DateFormatter.createValidDate(match, true) : null;
  }

  private static createValidDate(match: RegExpExecArray, includesTime = false): Date | null {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const hour = includesTime ? Number(match[4]) : 0;
    const minute = includesTime ? Number(match[5]) : 0;
    const date = new Date(year, month, day, hour, minute, 0, 0);
    const valid = date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day &&
      date.getHours() === hour &&
      date.getMinutes() === minute;
    return valid ? date : null;
  }

  static endOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  }

  static isWithin(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= DateFormatter.endOfDay(endDate);
  }

  static displayDateTime(date: Date): string {
    const datePart = [
      String(date.getDate()).padStart(2, "0"),
      String(date.getMonth() + 1).padStart(2, "0"),
      date.getFullYear()
    ].join("-");
    const timePart = [
      String(date.getHours()).padStart(2, "0"),
      String(date.getMinutes()).padStart(2, "0")
    ].join(":");
    return `${datePart} ${timePart}`;
  }
}

export class TextFormatter {
  static currency(value: number): string {
    return new Intl.NumberFormat("en-US").format(value);
  }

  static escape(value: string | number | null | undefined): string {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
}
