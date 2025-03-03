import { PrismaClient } from "@prisma/client";




const prisma = new PrismaClient()


export const getAllUsers =  async (req,res)=>{

    try {

        const response  = await prisma.user.findMany();

        if (!response) {
            return res.status(404).json({ success: false, error: "No users found" });
          }

        const users  = response.map((user)=>{

            return {
                id:user.id,
                name:user.name,
                email:user.email,
                phone :user.phone,
                state:user.state,
                city:user.city,
                district:user.district,
                role:user.role
            }

        })

        res.status(200).json({success:true,users:users})

    }

    catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      } 


}


export const getUserByEmailId = async (req,res)=>{

    try{
        const {email} = req.params;

        const user = await prisma.user.findUnique({
            where:{email}
        })

        if(!user){
            return res.status(404).json({success:false,error:"User not found"})
        }

        res.status(200).json({success:true,user:user})
    }
    
    catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }
}