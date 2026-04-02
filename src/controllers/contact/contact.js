class ContactController {
    static showContactForm(req, res, next) {
        try {
            res.render('contact/contact', {
                title: 'Contact Us',
                user: req.session.user || null,
                message: req.query.message || null
            });
        } catch (error) {
            next(error);
        }
    }

    static submitContactForm(req, res, next) {
        try {
            const { name, email, subject, message } = req.body;

            // Basic validation
            if (!name || !email || !subject || !message) {
                return res.redirect('/contact?message=Please fill in all fields');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.redirect('/contact?message=Please enter a valid email address');
            }

            // TODO: Send email or store message in database
            console.log('Contact form submission:', { name, email, subject, message });

            // Redirect with success message
            res.redirect('/contact?message=Thank you for your message! We will get back to you soon.');
        } catch (error) {
            next(error);
        }
    }
}

export default ContactController;
