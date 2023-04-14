import { justifyText } from "../services";

const input = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lorem id orci congue gravida eget ut nunc.';
const expectedOutput80 = justifyText(input);
const receivedLines80 = expectedOutput80.split('\n').map(line => line.trim());
const expectedLines80 = expectedOutput80.trim().split('\n').map(line => line.trim());
const expectedOutput79 = justifyText(input,79);
const receivedLines79 = expectedOutput79.split('\n').map(line => line.trim());
const expectedLines79 = expectedOutput79.trim().split('\n').map(line => line.trim());
const inputNoSpace = 'LoremipsumdolorsitametconsecteturadipiscingelitSedvelloremidorciconguegravidaegetutnunc';
const expectedOutputNoSpace = 'LoremipsumdolorsitametconsecteturadipiscingelitSedvelloremidorciconguegravidaegetutnunc';

describe('sanity check', () => {
    it('should return true', () => {
        expect(true).toBeTruthy();
    });
});

describe('justifyText function', () => {
  it('should justify text with 80 characters by default', () => {
    expect(receivedLines80).toEqual(expectedLines80);
    expect(receivedLines80[0].length).toBe(80);
    expect(receivedLines80[1].length).toBe(28);
    expect(receivedLines80.length).toBe(2);
  });
  
  it('should justify text with the given line length', () => {
    expect(receivedLines79).toEqual(expectedLines79);
    expect(receivedLines79[0].length).toBe(79);
    expect(receivedLines79[1].length).toBe(28);
    expect(receivedLines79.length).toBe(2);
    expect(receivedLines79[receivedLines79.length - 1].length).toBeLessThanOrEqual(79);
  });

  it('should handle empty input', () => {
    const expectedOutput = '';
    expect(justifyText('')).toEqual(expectedOutput);
  });
  
  it('should handle input shorter than the line length', () => {
    const input = 'Lorem ipsum';
    const expectedOutput = 'Lorem ipsum';
    expect(justifyText(input)).toBe(expectedOutput);
  });
  
  it('should handle input with no spaces', () => {
    expect(justifyText(inputNoSpace).trim()).toEqual(expectedOutputNoSpace.trim());
  });

});
  