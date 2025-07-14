require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB (MongoDB example)
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, university, role } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'Email already registered' });
        }

        // Create new user
        const user = new User({
            email,
            password,
            name,
            university,
            role
        });

        await user.save();

        // Generate token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);

        res.status(201).send({ user, token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
        res.send({ user, token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Application routes
app.post('/api/applications', auth, upload.array('documents', 3), async (req, res) => {
    try {
        const applicationData = {
            ...req.body,
            studentId: req.user.userId,
            documents: req.files.map(file => file.path)
        };

        const application = new Application(applicationData);
        await application.save();

        res.status(201).send(application);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/api/applications', auth, async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('studentId', 'name email')
            .populate('interview');

        res.send(applications);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/api/applications/:id', auth, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('studentId', 'name email')
            .populate('interview');

        if (!application) {
            return res.status(404).send({ error: 'Application not found' });
        }

        res.send(application);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.put('/api/applications/:id/status', auth, async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!application) {
            return res.status(404).send({ error: 'Application not found' });
        }

        res.send(application);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Interview routes
app.post('/api/interviews', auth, async (req, res) => {
    try {
        const interview = new Interview(req.body);
        await interview.save();

        // Update application with interview reference
        await Application.findByIdAndUpdate(
            req.body.applicationId,
            { interview: interview._id }
        );

        res.status(201).send(interview);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/api/interviews/:id', auth, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id)
            .populate('applicationId');

        if (!interview) {
            return res.status(404).send({ error: 'Interview not found' });
        }

        res.send(interview);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
