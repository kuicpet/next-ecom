import nc from 'next-connect';
import { isAuth, isAdmin } from '../../../../../utils/auth';
import db from '../../../../../utils/db';
import User from '../../../../../models/User';

const handler = nc({});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  db.connect();
  const user = await User.findById(req.query.id);
  db.disconnect();
  res.send(user);
});

handler.delete(async (req, res) => {
  db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({ meaasge: 'User deleted successfully' });
  } else {
      await db.disconnect()
      res.status(404).send({message: 'user not found'})
  }
});
export default handler;