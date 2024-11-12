export const generatePassword = (length) => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const lettersUpper = letters.toUpperCase();
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+";

  let password = "";
  let dico = letters + lettersUpper + numbers + symbols;
  for (let i = 0; i < length; i++) {
    password += dico.charAt(Math.floor(Math.random() * dico.length));
  }

  return password;
};
