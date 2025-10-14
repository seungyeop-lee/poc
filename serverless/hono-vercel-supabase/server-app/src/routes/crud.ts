import {Hono} from "hono";
import {createUser, deleteUser, getUserById, getUsersWithPostsCount} from "../db/user-queries.js";
import {createPost, getPostsForLast24Hours, updatePost} from "../db/posts-queries.js";

const router = new Hono()

// User endpoints
router.post('/users', async (c) => {
  try {
    const body = await c.req.json();
    const {name, age, email} = body;

    if (!name || !age || !email) {
      return c.json({error: 'Missing required fields: name, age, email'}, 400);
    }

    await createUser({name, age, email});
    return c.json({message: 'User created successfully'}, 201);
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({error: 'Failed to create user'}, 500);
  }
});

router.get('/users/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({error: 'Invalid user ID'}, 400);
    }

    const users = await getUserById(id);
    if (users.length === 0) {
      return c.json({error: 'User not found'}, 404);
    }

    return c.json(users[0]);
  } catch (error) {
    console.error('Error getting user:', error);
    return c.json({error: 'Failed to get user'}, 500);
  }
});

router.get('/users', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const pageSize = parseInt(c.req.query('pageSize') || '5');

    const users = await getUsersWithPostsCount(page, pageSize);
    return c.json({
      data: users,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return c.json({error: 'Failed to get users'}, 500);
  }
});

router.delete('/users/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({error: 'Invalid user ID'}, 400);
    }

    await deleteUser(id);
    return c.json({message: 'User deleted successfully'});
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({error: 'Failed to delete user'}, 500);
  }
});

// Post endpoints
router.post('/posts', async (c) => {
  try {
    const body = await c.req.json();
    const {title, content, userId} = body;

    if (!title || !content || !userId) {
      return c.json({error: 'Missing required fields: title, content, userId'}, 400);
    }

    await createPost({title, content, userId});
    return c.json({message: 'Post created successfully'}, 201);
  } catch (error) {
    console.error('Error creating post:', error);
    return c.json({error: 'Failed to create post'}, 500);
  }
});

router.get('/posts/recent', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const pageSize = parseInt(c.req.query('pageSize') || '5');

    const posts = await getPostsForLast24Hours(page, pageSize);
    return c.json({
      data: posts,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error getting recent posts:', error);
    return c.json({error: 'Failed to get recent posts'}, 500);
  }
});

router.patch('/posts/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({error: 'Invalid post ID'}, 400);
    }

    const body = await c.req.json();
    const {title, content} = body;

    if (!title && !content) {
      return c.json({error: 'At least one field (title or content) must be provided'}, 400);
    }

    const updateData: {title?: string; content?: string} = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    await updatePost(id, updateData);
    return c.json({message: 'Post updated successfully'});
  } catch (error) {
    console.error('Error updating post:', error);
    return c.json({error: 'Failed to update post'}, 500);
  }
});

export default router
