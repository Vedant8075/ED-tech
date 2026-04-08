const User=require("../models/User")
const mailSender=require("../utils/mailSender")

exports.resetPasswordToken=async(req,res)=>{
    try{
        const email=req.body.email
        const user=await User.findOne({email})
        if(!user)
        {
            return res.json({
                success:false,
                message:"your email is not registered with us"
            })
        }
        const token=crypto.randomUUID()
        const updatedDetails=await User.findOneAndUpdate({email:email},
                                                    {
                                                        token:token,
                                                        resetPasswordExpires: Date.now() + 5 * 60 * 1000
                                                    },
                                                    {new:true});
        const url=`http://localhost:3000/update-password/${token}`    
        await mailSender(email,"password reset link",`password reset link ${url}`)
        return res.json({
            success:true,
            message:"please check email and change the password"
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })

    }
}
                                                 
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;


    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token expired, please request again",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { token: token },
      {
        password: hashedPassword,
        token: undefined,
        resetPasswordExpires: undefined,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};