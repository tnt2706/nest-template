export class ValidateJsonString {
  static validateJsonString(string) {
    const strongRegex = new RegExp(/{\s*"\w+"\s*:\s*"\w+"\s*}/);
    return strongRegex.test(string);
  }
}
