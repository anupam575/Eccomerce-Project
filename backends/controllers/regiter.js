
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Generate 6 digit OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(rawOtp, 12);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      otp: hashedOtp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 min
    });

    await sendEmail({
      to: normalizedEmail,
      subject: "Verify Your Email",
      text: `Your OTP is ${rawOtp}. It expires in 10 minutes.`,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email })
      .select("+otp +otpExpiry");

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.emailVerified)
      return res.status(400).json({ message: "Already verified" });

    if (!user.otpExpiry || user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid OTP" });

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    // ✅ Now generate token
    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      accessToken,
      refreshToken,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const resendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // ✅ Generate new OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(rawOtp, 12);

    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save({ validateBeforeSave: false });

    // ✅ Send Email
    await sendEmail({
      to: normalizedEmail,
      subject: "Resend Email Verification OTP",
      text: `Your new OTP is ${rawOtp}. It expires in 10 minutes.`,
    });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter Email & Password",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Blocked user check
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    // ✅ Email verified check (CRITICAL)
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ============================================
    // ✅ LOGIN NOTIFICATION
    // ============================================

    const io = req.app.get("io");

    await sendNotification({
      io,
      userId: user._id,
      type: "alert",
      title: "Login Successful",
      message: "A new login to your account was detected.",
    });

    // ✅ Issue tokens
    sendToken(user, 200, res, "Login successful");

  } catch (err) {
    console.error("❌ Login Error:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};