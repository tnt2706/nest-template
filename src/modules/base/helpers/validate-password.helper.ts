export class ValidatePassword {

  static validatePassword(string) {
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'
    );
    return strongRegex.test(string)
  }
}