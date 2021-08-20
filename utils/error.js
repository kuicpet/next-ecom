import db from './db';

const getError = (error) =>
  error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;

const onError = async (err, req, res, next) => {
  await db.disconnect();
  res.status(500).send({ message: err.toString()});
};
export { getError, onError };
