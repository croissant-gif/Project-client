import dbConnect from '../../../utils/dbConnect';
import Todo from '../../../models/Todo';

dbConnect();

export async function GET() {
  try {
    const todos = await Todo.find({});
    return new Response(JSON.stringify(todos), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch todos', { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  try {
    const todo = await Todo.create(body);
    return new Response(JSON.stringify(todo), { status: 201 });
  } catch (error) {
    return new Response('Failed to create todo', { status: 400 });
  }
}

export async function DELETE(request) {
  const body = await request.json();
  try {
    const { id } = body; // Expecting the todo ID in the request body
    await Todo.findByIdAndDelete(id);
    return new Response(null, { status: 204 }); // No content to return on success
  } catch (error) {
    return new Response('Failed to delete todo', { status: 500 });
  }
}
