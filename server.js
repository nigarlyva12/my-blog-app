require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo');
const path = require('path');
const app = express();
const User = require('./models/user');
const Blog = require('./models/blog');
const PORT = process.env.PORT || 3000;

const isAdmin = require('./middleware/isAdmin');
 require('./config/db')();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, 
    collectionName: 'sessions',
    ttl: 60 * 60 * 24 * 7 
  })
}));

app.use((req,res,next) => {
  res.locals.user = req.session.user;
  next();
});

app.get('/admin/blog/new', isAdmin, (req,res) => {
  res.render('blog-new');
})

app.get('/', (req, res) => {
  res.render('home'); 
});

app.post('/register', async (req,res) =>{
  const { username, email, password } = req.body;
  const isAdmin = false;
  
  try {
    const existing = await User.findOne({ email });
    if(existing) return res.status(409).send('Email already registered');

    const newUser = new User({ username, email, password, isAdmin });
    await newUser.save();

    req.session.userId = newUser._id;
    req.session.user = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin
    };
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.send('Error creating user');
  }
});

//login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.send('Invalid email or password');

    
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
      return res.status(400).send('invalid email or password');
    }
    req.session.userId = user._id;
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Login failed');
  }
});
//logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Error logging out');
    res.redirect('/');
  });
});
//user details
app.get('/user', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    res.render('user', { user: req.session.user });
 });
app.get('/blogs', async (req,res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'username');
    
    res.render('blogs', { blogs });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching blogs');
  }
})
 //new-blog route
 app.post('/admin/blog/new', isAdmin, async (req,res) => {
  const { title, content } = req.body;

 const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];

  const newBlog = new Blog({
    title,
    content,
    tags,
    author: req.session.user._id
  });
  await newBlog.save();
  res.redirect('/blogs');
 })
app.get('/blogs/:id', async (req,res) =>{
    const blogId = req.params.id;

    try{
        const blog = await Blog.findById(blogId).populate('author', 'username');;
        if(!blog){
            return res.status(400).send('Blog not found');
        }
        res.render('blog-details', { blog });
    }catch(error){
        res.status(500).send('Server error');
    }
});

app.post('/admin/blogs/:id/delete', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send('Unauthorized');
  }

  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete blog');
  }
});

app.get('/blogs/search', async (req,res) => {
  const query = req.query.q || '';
  const blogs = await Blog.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } }
    ]
  }).limit(20);
  res.json(blogs);
});

app.get('/about', (req,res) => {
  res.render('about');
});

app.get('/user/edit', (req,res) => {
  res.render('edit');
});

app.post('/user/edit', async (req,res) => {
  if(!req.session.user){
    return res.redirect('/');
  }

  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send('User not found');

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password && req.body.password.trim() !== '') {
      user.password = req.body.password;
    }
    console.log(password);
    await user.save();
    req.session.user = user; 
    res.redirect('/user');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile');
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});