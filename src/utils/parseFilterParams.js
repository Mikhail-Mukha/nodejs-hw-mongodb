const BOOLEANS = ['true', 'false'];

const parseBoolean = (value) => {
  if (!BOOLEANS.includes(value)) return;
  return value === 'true' ? 'true' : 'false';
};

const TYPE = ['home', 'personal', 'work'];

const parseType = (value) => {
  if (!TYPE.includes(value)) return value;
};

export const parseFilterParams = (query) => {
  const filter = {
    contactType: parseType(query.contactType),
    isFavourite: parseBoolean(query.isFavourite),
  };
  return filter;
};
