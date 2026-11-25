import mongoose from "mongoose";
import { parseDate, formatDate } from "../utils/date.js";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      minlength: [3, "title must be at least 3 characters"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
      trim: true,
      enum: {
        values: ["Seminer", "Atölye", "Konferans", "Söyleşi", "Yarışma"],
        message: "Geçersiz kategori: {VALUE}",
      },
    },
    date: {
      type: Date,
      required: [true, "date is required"],
      set: parseDate,
      get: formatDate,
    },
    capacity: {
      type: Number,
      required: [true, "capacity is required"],
      min: [0, "capacity must be at least 0"],
      default: 0,
    },
    time: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
    toObject: {
      getters: true,
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
    id: false,
  }
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema, "events");

export default Event;
