import { getValidationErrors } from '../../middleware/validators.js';

class ContactController {
    static showContactForm(req, res, next) {
        try {
            res.render('contact/contact', {
                title: 'Contact Us',
                user: req.session.user || null,
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
                errors.forEach((errorMessage) => {
                    req.flash('error', errorMessage);
                });

                return res.redirect('/contact');
            }

            // TODO: Send email or store message in database
            console.log('Contact form submission:', { name, email, subject, message });

            req.flash('success', 'Thank you for contacting us! We will respond soon.');
            res.redirect('/contact');
        } catch (error) {
            console.error('Error saving contact form:', error);
            req.flash('error', 'Unable to submit your message. Please try again later.');
            res.redirect('/contact');
        }
    }
}

export default ContactController;
