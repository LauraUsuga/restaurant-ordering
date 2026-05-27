import mongoose from "mongoose"

const TimelineEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },

    timestamp: {
      type: String,
      required: true,
    },

    orderId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      enum: ["web", "api", "worker"],
      required: true,
    },

    correlationId: {
      type: String,
      required: true,
    },

    payload: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: false,
  }
)

export const TimelineEvent = mongoose.model("TimelineEvent", TimelineEventSchema)