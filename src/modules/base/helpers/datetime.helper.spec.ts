import { DateTimeHelper } from './datetime.helper';


describe('DateTimeHelper', () => {
  describe('#isValidTimezone', () => {
    it('should return false if timezoneName is invalid', () => {
      const tzName = 'Asia/ddaad';
      expect(DateTimeHelper.isValidTimezone(tzName)).toBe(false);
    });
    it('should return true if timezoneName is valid', () => {
      const tzName = 'Asia/Saigon';      
      expect(DateTimeHelper.isValidTimezone(tzName)).toBe(true);
    });        
  });
  describe('#guessTimeZoneName', () => {
    it('should return a string', () => {
      expect(DateTimeHelper.guessTimeZoneName()).toBeTruthy();
    });
  })
});