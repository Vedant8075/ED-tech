const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },

    courseDescription: String,

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    whatYouWillLearn: String,

    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],

    ratingAndReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
      },
    ],

    price: Number,

    thumbnail: String,

    tag: {
      type:[String],
      required:true
    },
    
    category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Category"
    },

    instructions:{
      type:[String]
    },

    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],

    status:{
      type:String,
      enum:["Draft","Published"]
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", courseSchema);
