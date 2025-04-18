import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function GET() {
    try {
      console.log("GET /api/tasks called"); // ✅ log to confirm
      const tasks = await prisma.task.findMany();
      console.log("Fetched tasks:", tasks); // ✅ log results
      return NextResponse.json(tasks);
    } catch (err) {
      console.error("Error in GET /api/tasks:", err); // ✅ log the actual error
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

// export async function POST(req: Request) {
//     const { text } = await req.json();
//     const newTask = await prisma.task.create({
//         data: { text },
//     });
//     return NextResponse.json(newTask);
// }
export async function POST(request: Request) {
    console.log("POST /api/tasks called");
    const body = await request.json();
    console.log("Request body:", body);

    const { text } = body;

    const newTask = await prisma.task.create({
        data: {
            text,
        },
    });
    return NextResponse.json(newTask);

}

//Mark task as completed or delete it
export async function PUT(req: Request) {
    const { id, completed } = await req.json();
    const updatedTask = await prisma.task.update({
        where: { id },
        data: { completed }
    });
    return NextResponse.json(updatedTask);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
}