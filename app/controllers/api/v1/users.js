const redis = require("redis");
const client = redis.createClient();
const common = require("../../../lib/common");
const encryptDecrypt = require("../../../lib/encryption");
const bcrypt = require("bcryptjs");
module.exports = function (router) {

  router.post('/register', function (req, res) {
    try {
      req.body.password = common.getHashedPassword(req.body.password);
      req.body.id = 1;
      client.hmset("user", req.body, function (err, user) {
        if (err) {
          return res.http400(err)
        } else {
          client.hgetall("user", function (err, user) {
            return res.http200({ user: { id: user.id, email: user.email } })
          });
        }
      });
    }catch(err){
      return res.http400(err.message);
    } 
  });

  router.post('/login', function (req, res) {
    try {
      client.hgetall("user", function (err, user) {
        if (err) {
          return res.http400("Invalid credentials!");
        }
        if (!bcrypt.compareSync(req.body.password, user.password) || req.body.email !== user.email) return res.http401("Invalid credentials!");
        let token = encryptDecrypt.encrypt(common.createToken({
          id: user.id,
          email: user.email
        }))
        return res.http200({ JWT: token })
      });
    } catch (err) {
      return res.http200(err.message);
    }
  });

  router.get('/user', function (req, res) {
    try {
      client.hgetall("user", function (err, user) {
        if (err) {
          return res.http400("No user found!");
        }
        return res.http200({ user: { id: user.id, email: user.email } })
      });
    } catch (err) {
      return res.http400(err.message);
    }
  });

  router.post('/create-task', async function (req, res) {
    try {
      client.get("tasks", function (err, tasks) {
        tasks = JSON.parse(tasks);
        if (tasks) {
          req.body.id = tasks.length + 1;
          tasks.push(req.body);
        } else {
          tasks = [];
          req.body.id = 1;
          tasks.push(req.body)
        }
        tasks = JSON.stringify(tasks);
        client.set("tasks", tasks, function (err, tasks) {
          if (err) {
            return res.http400("Failed to save task.")
          }
          return res.http200({ task: { id: req.body.id, name: req.body.name } });
        })
      });
    } catch (error) {
      return res.http400(error.message);
    }
  });

  router.get('/list-tasks', async function (req, res) {
    try {
      client.get("tasks", function (err, tasks) {
        if (err) {
          return res.http400("No tasks found")
        }
        return res.http200({ tasks: JSON.parse(tasks) })
      });
    } catch (err) {
      return res.http400(err.message);
    }
  });
};
