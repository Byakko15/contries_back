const handleError = (error) => {
  if (error.response) {
    if (error.response.data) {
      return error.response.data;
    } else if (error.response.message) {
      return error.response.message;
    } else {
      return error.response;
    }
  } else if (error.request) {
    if (error.request.data) {
      return error.request.data;
    } else {
      return error.request;
    }
  } else if (error.message) {
    return error.message;
  } else {
    return error;
  }
};

module.exports = { handleError };
