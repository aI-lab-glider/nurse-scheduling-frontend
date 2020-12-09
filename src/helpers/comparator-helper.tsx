export type ComparatorValues = 1 | 0 | -1;
export type Order = "asc" | "desc";

export class ComparatorHelper {
  public static descendingComparator<T>(a: T, b: T, orderBy: keyof T): ComparatorValues {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    } else if (b[orderBy] > a[orderBy]) {
      return 1;
    } else {
      return 0;
    }
  }

  public static getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => ComparatorValues {
    return order === "desc"
      ? (a, b): ComparatorValues => ComparatorHelper.descendingComparator(a, b, orderBy)
      : (a, b): ComparatorValues =>
          -ComparatorHelper.descendingComparator(a, b, orderBy) as ComparatorValues;
  }

  public static stableSort<T>(array: T[], order: Order, orderBy: keyof T): T[] {
    const stabilizedArray = array.map((el, index) => [el, index] as [T, number]);
    const comparator = ComparatorHelper.getComparator(order, orderBy);
    stabilizedArray.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedArray.map((el) => el[0]);
  }
}
