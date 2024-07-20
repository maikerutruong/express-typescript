import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema(
  {
    data: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);

// Define TaskModel model with ITask interface
const Exchanges = mongoose.model("Exchanges", exchangeSchema);

export default Exchanges;
