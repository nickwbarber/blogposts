const logger = require("./logger");
const { getTokenFrom } = require("../utils/misc");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  switch (err.name) {
    case "CastError":
      return res.status(400).send({ error: "malformatted id" });
    case "ValidationError":
      return res.status(400).json({ error: err.message });
    default:
      break;
  }

  next(err);
};

const tokenExtractor = (req, res, next) => {
  req.token = getTokenFrom(req);
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
