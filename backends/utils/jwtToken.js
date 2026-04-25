import bcrypt from "bcryptjs";


const sendToken = async (user, statusCode, res) => {
  try {
    const accessToken = user.getAccessToken();
    const refreshToken = await user.getRefreshToken();

    const isSecure = process.env.NODE_ENV === "production";

    const cookieOptions = (expiresIn) => ({
      expires: new Date(Date.now() + expiresIn),
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "None" : "Lax",
      path: "/",
    });

    res
      .status(statusCode)
      .cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000))
      .cookie("refreshToken", refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000))
      .json({
        success: true,
        message: "Login successful",
      });

  } catch (err) {
    console.error("💥 sendToken error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default sendToken;