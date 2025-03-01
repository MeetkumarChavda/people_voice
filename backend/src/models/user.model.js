const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define schema for user document
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    address: {
        address: String,
        coordinates: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0],
            },
        },
    },
    role: {
        type: String,
        enum: ["citizen", "organization", "government", "superAdmin"],
        default: "citizen",
    },
    // If role is organization, category can be NGO or other
    // If role is government, category can be MunicipalCorporation or AreaCounsellor
    category: {
        type: String,
        enum: ["NGO", "other", "MunicipalCorporation", "AreaCounsellor"],
        // Required only for organization and government roles
        validate: {
            validator: function (value) {
                if (
                    this.role === "organization" &&
                    !["NGO", "other"].includes(value)
                ) {
                    return false;
                }
                if (
                    this.role === "government" &&
                    !["MunicipalCorporation", "AreaCounsellor"].includes(value)
                ) {
                    return false;
                }
                return true;
            },
            message: (props) =>
                `${props.value} is not a valid category for the selected role!`,
        },
    },
    // Reference to Municipal Corporation (only for AreaCounsellor category)
    subcategory: {
        municipalCorporationID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // Required only for AreaCounsellor
            validate: {
                validator: function (value) {
                    return !(
                        this.role === "government" &&
                        this.category === "AreaCounsellor" &&
                        !value
                    );
                },
                message: (props) =>
                    "Area Counsellor must be associated with a Municipal Corporation!",
            },
        },
        municipalCorporationName: {
            type: String,
        },
    },
    areaCode: String,
    profilePicture: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: Date,
    points: {
        type: Number,
        default: 0,
    },
    badges: [
        {
            name: String,
            awardedDate: Date,
            description: String,
        },
    ],
    issuesReported: {
        type: Number,
        default: 0,
    },
    issuesSolved: {
        type: Number,
        default: 0,
    },
    stats: {
        totalPublicIssues: {
            type: Number,
            default: 0,
        },
        totalPrivateIssues: {
            type: Number,
            default: 0,
        },
        upvotesReceived: {
            type: Number,
            default: 0,
        },
        commentsPosted: {
            type: Number,
            default: 0,
        },
        solutionsProvided: {
            type: Number,
            default: 0,
        },
    },
});

// Create index for geospatial queries
userSchema.index({ "address.coordinates": "2dsphere" });

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
    // Only hash the password if it's modified or new
    if (!this.isModified("passwordHash")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
