import _ = require('lodash');

export class StringHelper {

  static randomString(length: number = 8) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static randomPassword(length: number = 8) {
    const characters = 'abcdefghijklmnopqrstuvwxyz'
    const charactersnumber = '0123456789'

    const result = ([...Array(8)].map((ar, index) => {
      if (index === 0) return (characters.charAt(Math.floor(Math.random() * characters.length))).toUpperCase();
      if (index === 1) return (characters.charAt(Math.floor(Math.random() * characters.length)));
      if (index === 2) return (charactersnumber.charAt(Math.floor(Math.random() * charactersnumber.length)));
      return (`${charactersnumber}${characters}`.charAt(Math.floor(Math.random() * `${charactersnumber}${characters}`.length)));
    })).join('')
    return result;
  }


  static parseEmail(email: string) {
    const name = email.substring(0, email.lastIndexOf("@"));
    const domain = email.substring(email.lastIndexOf("@") + 1);
    return {
      name,
      domain,
    }
  }

}
