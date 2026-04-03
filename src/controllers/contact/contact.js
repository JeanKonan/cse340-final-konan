import { getValidationErrors } from '../../middleware/validators.js';

class ContactController {
    static showContactForm(req, res, next) {
        try {
            res.render('contact/contact', {
                title: 'Contact Us',
                user: req.session.user || null,
                message: req.query.message || null,
                error: req.query.error || null,
                errors: req.query.error ? [req.query.error] : [],
                formData: {}
            });
        } catch (error) {
            next(error);
        }
    }

    static submitContactForm(req, res, next) {
        try {
            const { name, email, subject, message } = req.body;
            const errors = getValidationErrors(req);

            if (errors.length > 0) {
                return res.status(400).render('contact/contact', {
                    title: 'Contact Us',
                    user: req.session.user || null,
                    message: null,
                    error: errors[0],
                    errors,
                    formData: { name, email, subject, message }
                });
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
