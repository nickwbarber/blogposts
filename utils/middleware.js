const logger = require("./logger");
const { getUserFrom } = require("../utils/misc");

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
      return res.status(400).json({ error: `ValidationError: ${err.message}` });
    case "JsonWebTokenError":
      return res.status(401).json({ error: "invalid token" });
    case "TokenExpiredError":
      return res.status(401).json({ error: "token expired" });
    default:
      break;
  }

  next(err);
};

const userExtractor = async (req, res, next) => {
  req.user = await getUserFrom(req);
  next();
};

module.exports = {
  userExtractor,
  unknownEndpoint,
  requestLogger,
  errorHandler,
};
