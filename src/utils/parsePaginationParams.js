const parseNumber = (number, defaultValue) => {
    const parsedNumber = parseInt(number, 10);
    return isNaN(parsedNumber) || parsedNumber <= 0 ? defaultValue : parsedNumber;
  };
  
  export const parsePaginationParams = (query) => {
    const { page, perPage } = query;
  
    return {
      page: parseNumber(page, 1),        
      perPage: parseNumber(perPage, 10), 
    };
  };
  