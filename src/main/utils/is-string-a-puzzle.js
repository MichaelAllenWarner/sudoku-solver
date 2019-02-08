export default stringInput => {
  const stringWithZeroes = stringInput.replace(/[^0-9]/gi, '0');

  return (stringWithZeroes.length === 81
    && Number.isInteger(+stringWithZeroes)
    && +stringWithZeroes >= 0);
};
