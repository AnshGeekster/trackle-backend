import {z} from 'zod'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ticketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  fault: z.string().min(5, "Fault description must be at least 5 characters"),
  type: z.enum(["ELECTRICITY", "ROAD", "WATER", "GAS", "INTERNET", "OTHER"]),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING"),
  userId: z.string().cuid(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  district: z.string().min(2, "District must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  latitude: z.number().min(-90).max(90, "Invalid latitude value"),
  longitude: z.number().min(-180).max(180, "Invalid longitude value"),
});

export const createTicket = async (req, res) => {
  try {
    const parsed = ticketSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.errors });
    }

    const { title, fault, type, status, userId, address, city, district, state, latitude, longitude } = parsed.data;

    const ticket = await prisma.ticket.create({
      data: {
        title,
        fault,
        type,
        status,
        userId,
        address,
        city,
        district,
        state,
        latitude,
        longitude,
      },
    });

    res.status(201).json({ success: true, message: "Ticket created successfully!", ticket });
  } catch (error) {
    console.error("Error in creating ticket:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};



export const getAllTickets = async (req,res)=>{


    try {
        const tickets = await prisma.ticket.findMany({
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
    
        res.status(200).json({ success: true, tickets });
      } catch (error) {
        console.error("Error in fetching tickets:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }

}


export const updateStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Allowed values: PENDING, IN_PROGRESS, COMPLETED.",
      });
    }

    // Update the ticket status
    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    });

    return res.status(200).json({
      success: true,
      message: "Ticket status updated successfully!",
      ticket,
    });
  } catch (error) {
    console.error("Error in updating ticket status:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};



export const getUserTickets = async (req,res)=>{

    try {
        const { userId } = req.params;
    
        const tickets = await prisma.ticket.findMany({
          where: {
            userId,
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
    
        res.status(200).json({ success: true, tickets });
      } catch (error) {
        console.error("Error in fetching user tickets:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
      }

}