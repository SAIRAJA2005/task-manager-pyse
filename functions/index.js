// /**
//  * Firebase Cloud Functions
//  */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

// Enable CORS for all routes
const corsHandler = cors({ origin: true });

// Fetch all tasks for a user
exports.api = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const path = req.path.split('/').filter(p => p);

    // GET /tasks?userId=xxx
    if (req.method === 'GET' && path[0] === 'tasks') {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: 'userId required' });

      try {
        const snapshot = await db.collection(`users/${userId}/tasks`)
          .orderBy('createdAt', 'desc')
          .get();
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json(tasks);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    // POST /addTask
    if (req.method === 'POST' && path[0] === 'addTask') {
      const { task } = req.body;
      if (!task || !task.userId) return res.status(400).json({ error: 'Invalid task data' });

      try {
        await db.collection(`users/${task.userId}/tasks`).add({
          title: task.title,
          completed: task.completed,
          createdAt: admin.firestore.Timestamp.fromDate(new Date(task.createdAt))
        });
        return res.status(201).json({ message: 'Task added' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    // PUT /updateTask
    if (req.method === 'PUT' && path[0] === 'updateTask') {
      const { id, completed, userId } = req.body;
      if (!id || !userId) return res.status(400).json({ error: 'id and userId required' });

      try {
        await db.doc(`users/${userId}/tasks/${id}`).update({ completed });
        return res.status(200).json({ message: 'Task updated' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    // DELETE /deleteTask
    if (req.method === 'DELETE' && path[0] === 'deleteTask') {
      const { id, userId } = req.body;
      if (!id || !userId) return res.status(400).json({ error: 'id and userId required' });

      try {
        await db.doc(`users/${userId}/tasks/${id}`).delete();
        return res.status(200).json({ message: 'Task deleted' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(404).json({ error: 'Route not found' });
  });
});
