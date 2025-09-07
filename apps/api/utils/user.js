// /api/utils/user.js
const users = [];
const bcrypt = require('bcryptjs');

exports.getUserByEmail = async (email) => users.find(u => u.email === email);
exports.verifyPassword = async (password, hash) => bcrypt.compare(password, hash);
exports.createUser = async ({ email, password, username }) => {
  const hash = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, password: hash, username };
  users.push(user);
  return user;
};
exports.getOrCreateDiscordUser = async (discordUser) => {
  let user = users.find(u => u.discordId === discordUser.id);
  if (!user) {
    user = { id: users.length + 1, email: discordUser.email, username: discordUser.username, discordId: discordUser.id };
    users.push(user);
  }
  return user;
};
