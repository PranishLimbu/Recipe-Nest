const Counter = require("../models/counter.model");

const getNextSequence = async (counterName, Model, fieldName) => {
  const existingCounter = await Counter.findById(counterName);

  if (!existingCounter) {
    const latestDocument = await Model.findOne({
      [fieldName]: { $exists: true, $ne: null },
    })
      .sort({ [fieldName]: -1 })
      .select(fieldName)
      .lean();

    const startingValue = latestDocument?.[fieldName] || 0;

    await Counter.findByIdAndUpdate(
      counterName,
      { $setOnInsert: { seq: startingValue } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true }
  );

  return counter.seq;
};

module.exports = {
  getNextSequence,
};
