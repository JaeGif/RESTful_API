const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const mongoose = require('mongoose');

const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const async = require('async');
const { body, validationResult } = require('express-validator');
const router = require('../routes/posts');

dayjs.extend(relativeTime);
