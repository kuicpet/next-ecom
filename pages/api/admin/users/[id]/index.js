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

export default handler;