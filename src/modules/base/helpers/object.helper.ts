export class ObjectHelper {
  static removeElementsWithValue(source: object, valueToRemove = undefined) {
    for(const property in source) {
      if (source[property] === valueToRemove) {
        delete source[property];
      }
    }
     return source;
  }
}