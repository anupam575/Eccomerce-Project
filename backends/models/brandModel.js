import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    logo: {
      public_id: String,
      url: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* 🔹 Pre-save hook (async, no next) */
brandSchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
});

/* 🔹 Pre-update hook (findOneAndUpdate, no next) */
brandSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = update.name.toLowerCase().replace(/\s+/g, "-");
    this.setUpdate(update);
  }
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
